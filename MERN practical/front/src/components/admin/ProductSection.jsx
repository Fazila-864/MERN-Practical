import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  getCategories,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../services/api.js'
import Modal from './Modal.jsx'
import {
  inputClass,
  labelClass,
  primaryBtnClass,
  secondaryBtnClass,
  imageUrl,
} from './formStyles.js'

const emptyForm = {
  name: '',
  description: '',
  price: '',
  stock: '',
  category: '',
  isActive: true,
  image: null,
}

const categoryIdOf = (product) =>
  product.category && typeof product.category === 'object'
    ? product.category._id
    : product.category

function FieldError({ children }) {
  if (!children) return null
  return <p className='mt-1 text-xs text-red-600'>{children}</p>
}

export default function ProductSection() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [fieldError, setFieldError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [catRes, prodRes] = await Promise.all([getCategories(), getProducts()])
      setCategories(catRes.data.data || [])
      setItems(prodRes.data.data || [])
    } catch (e) {
      setError(e?.response?.data?.message || 'Could not load products. Backend running hai?')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const categoryName = useMemo(() => {
    const map = new Map(categories.map((c) => [c._id, c.name]))
    return (product) => {
      if (product.category && typeof product.category === 'object') {
        return product.category.name || '—'
      }
      return map.get(product.category) || '—'
    }
  }, [categories])

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm, category: categories[0]?._id || '' })
    setFieldError('')
    setOpen(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    setForm({
      name: item.name || '',
      description: item.description || '',
      price: item.price ?? '',
      stock: item.stock ?? '',
      category: categoryIdOf(item) || '',
      isActive: item.isActive !== false,
      image: null,
    })
    setFieldError('')
    setOpen(true)
  }

  const closeModal = () => {
    if (saving) return
    setOpen(false)
  }

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] || null : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return setFieldError('Product name zaroori hai.')
    if (form.price === '' || Number.isNaN(Number(form.price))) {
      return setFieldError('Valid price daalein.')
    }
    if (!form.category) return setFieldError('Category select karein.')

    setSaving(true)
    setFieldError('')
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description,
        price: Number(form.price),
        stock: form.stock === '' ? 0 : Number(form.stock),
        category: form.category,
        isActive: form.isActive,
        image: form.image,
      }
      if (editing) {
        await updateProduct(editing._id, payload)
        setNotice('Product updated successfully.')
      } else {
        await createProduct(payload)
        setNotice('Product created successfully.')
      }
      setOpen(false)
      await load()
    } catch (err) {
      setFieldError(err?.response?.data?.message || 'Save nahi hua. Dubara koshish karein.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete product "${item.name}"?`)) return
    setDeletingId(item._id)
    setNotice('')
    try {
      await deleteProduct(item._id)
      setItems((prev) => prev.filter((p) => p._id !== item._id))
      setNotice('Product deleted.')
    } catch (err) {
      setError(err?.response?.data?.message || 'Delete nahi hua.')
    } finally {
      setDeletingId(null)
    }
  }

  const preview = form.image || (editing ? editing.image : '')

  return (
    <div>
      <div className='mb-5 flex flex-wrap items-center justify-between gap-3'>
        <div>
          <h2 className='font-display text-xl font-semibold text-slate-900'>Products (Food)</h2>
          <p className='text-sm text-slate-500'>Add, edit ya delete product.</p>
        </div>
        <button type='button' onClick={openCreate} className={primaryBtnClass}>
          <span className='material-symbols-outlined text-lg'>add</span>
          Add Product
        </button>
      </div>

      {categories.length === 0 && !loading && (
        <div className='mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700'>
          Pehle ek category add karein, phir product banayein.
        </div>
      )}
      {notice && (
        <div className='mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700'>
          {notice}
        </div>
      )}
      {error && (
        <div className='mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700'>{error}</div>
      )}

      {loading ? (
        <div className='space-y-3'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className='h-16 animate-pulse rounded-xl bg-orange-50' />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className='rounded-2xl border border-dashed border-orange-200 py-12 text-center text-slate-500'>
          Koi product nahi hai. "Add Product" se pehla item banayein.
        </div>
      ) : (
        <div className='overflow-x-auto rounded-2xl border border-orange-100'>
          <table className='w-full min-w-[760px] text-left text-sm'>
            <thead className='bg-orange-50/70 text-xs uppercase tracking-wide text-slate-500'>
              <tr>
                <th className='px-4 py-3'>Image</th>
                <th className='px-4 py-3'>Name</th>
                <th className='px-4 py-3'>Category</th>
                <th className='px-4 py-3'>Price</th>
                <th className='px-4 py-3'>Stock</th>
                <th className='px-4 py-3'>Status</th>
                <th className='px-4 py-3 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-orange-50'>
              {items.map((item) => (
                <tr key={item._id} className='align-middle'>
                  <td className='px-4 py-3'>
                    <div className='h-12 w-12 overflow-hidden rounded-lg bg-orange-50'>
                      {item.image && item.image !== 'null' ? (
                        <img
                          src={imageUrl(item.image)}
                          alt={item.name}
                          className='h-full w-full object-cover'
                        />
                      ) : (
                        <div className='grid h-full w-full place-items-center text-brand'>
                          <span className='material-symbols-outlined text-xl'>fastfood</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className='px-4 py-3 font-medium text-slate-900'>{item.name}</td>
                  <td className='px-4 py-3 text-slate-600'>{categoryName(item)}</td>
                  <td className='px-4 py-3 font-semibold text-brand'>Rs. {item.price}</td>
                  <td className='px-4 py-3 text-slate-600'>{item.stock ?? 0}</td>
                  <td className='px-4 py-3'>
                    <span
                      className={
                        'inline-flex rounded-full px-2.5 py-1 text-xs font-medium ' +
                        (item.isActive !== false
                          ? 'bg-green-50 text-green-700'
                          : 'bg-slate-100 text-slate-500')
                      }
                    >
                      {item.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className='px-4 py-3'>
                    <div className='flex justify-end gap-2'>
                      <button
                        type='button'
                        onClick={() => openEdit(item)}
                        className='inline-flex items-center gap-1 rounded-full border border-orange-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-orange-50'
                      >
                        <span className='material-symbols-outlined text-base'>edit</span>
                        Edit
                      </button>
                      <button
                        type='button'
                        onClick={() => handleDelete(item)}
                        disabled={deletingId === item._id}
                        className='inline-flex items-center gap-1 rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60'
                      >
                        <span className='material-symbols-outlined text-base'>delete</span>
                        {deletingId === item._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={open}
        title={editing ? 'Edit Product' : 'Add Product'}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className={labelClass} htmlFor='prod-name'>
              Name <span className='text-red-500'>*</span>
            </label>
            <input
              id='prod-name'
              name='name'
              value={form.name}
              onChange={handleChange}
              placeholder='e.g. Zinger Burger'
              className={inputClass}
            />
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <label className={labelClass} htmlFor='prod-price'>
                Price (Rs.) <span className='text-red-500'>*</span>
              </label>
              <input
                id='prod-price'
                name='price'
                type='number'
                min='0'
                value={form.price}
                onChange={handleChange}
                placeholder='0'
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor='prod-stock'>
                Stock
              </label>
              <input
                id='prod-stock'
                name='stock'
                type='number'
                min='0'
                value={form.stock}
                onChange={handleChange}
                placeholder='0'
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor='prod-category'>
              Category <span className='text-red-500'>*</span>
            </label>
            <select
              id='prod-category'
              name='category'
              value={form.category}
              onChange={handleChange}
              className={inputClass}
            >
              <option value=''>Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <FieldError>{fieldError}</FieldError>
          </div>

          <div>
            <label className={labelClass} htmlFor='prod-desc'>
              Description
            </label>
            <textarea
              id='prod-desc'
              name='description'
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder='Short description (optional)'
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor='prod-image'>
              Image
            </label>
            <div className='flex items-center gap-4'>
              <div className='h-16 w-16 overflow-hidden rounded-xl border border-orange-100 bg-orange-50'>
                {preview && preview !== 'null' ? (
                  <img src={imageUrl(preview)} alt='Preview' className='h-full w-full object-cover' />
                ) : (
                  <div className='grid h-full w-full place-items-center text-brand'>
                    <span className='material-symbols-outlined'>image</span>
                  </div>
                )}
              </div>
              <input
                id='prod-image'
                name='image'
                type='file'
                accept='image/*'
                onChange={handleChange}
                className='text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-orange-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand hover:file:bg-orange-200'
              />
            </div>
          </div>

          <label className='flex items-center gap-2 text-sm text-slate-700'>
            <input
              type='checkbox'
              name='isActive'
              checked={form.isActive}
              onChange={handleChange}
              className='h-4 w-4 accent-brand'
            />
            Active (menu par show ho)
          </label>

          <div className='flex justify-end gap-3 border-t border-orange-100 pt-4'>
            <button type='button' onClick={closeModal} className={secondaryBtnClass} disabled={saving}>
              Cancel
            </button>
            <button type='submit' className={primaryBtnClass} disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
