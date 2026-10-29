import { useCallback, useEffect, useState } from 'react'
import {
  getCategories,
  getProducts,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../services/api.js'
import Modal from './Modal.jsx'
import {
  inputClass,
  labelClass,
  primaryBtnClass,
  secondaryBtnClass,
  imageUrl,
} from './formStyles.js'

const emptyForm = { name: '', description: '', isActive: true, image: null }

const categoryIdOf = (product) =>
  product.category && typeof product.category === 'object'
    ? product.category._id
    : product.category

function FieldError({ children }) {
  if (!children) return null
  return <p className='mt-1 text-xs text-red-600'>{children}</p>
}

export default function CategorySection() {
  const [items, setItems] = useState([])
  const [products, setProducts] = useState([])
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
      setItems(catRes.data.data || [])
      setProducts(prodRes.data.data || [])
    } catch (e) {
      setError(e?.response?.data?.message || 'Could not load categories. Backend running hai?')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const productCount = (categoryId) =>
    products.filter((p) => categoryIdOf(p) === categoryId).length

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setFieldError('')
    setOpen(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    setForm({
      name: item.name || '',
      description: item.description || '',
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
    if (!form.name.trim()) {
      setFieldError('Category name zaroori hai.')
      return
    }
    setSaving(true)
    setFieldError('')
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description,
        isActive: form.isActive,
        image: form.image,
      }
      if (editing) {
        await updateCategory(editing._id, payload)
        setNotice('Category updated successfully.')
      } else {
        await createCategory(payload)
        setNotice('Category created successfully.')
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
    const count = productCount(item._id)
    if (count > 0) {
      setNotice('')
      setError(
        `"${item.name}" me ${count} product hain. Category delete karne se pehle unhe delete ya kisi doosri category me move karein.`
      )
      return
    }
    if (!window.confirm(`Delete category "${item.name}"?`)) return
    setDeletingId(item._id)
    setNotice('')
    setError('')
    try {
      await deleteCategory(item._id)
      setItems((prev) => prev.filter((c) => c._id !== item._id))
      setNotice('Category deleted.')
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
          <h2 className='font-display text-xl font-semibold text-slate-900'>Categories</h2>
          <p className='text-sm text-slate-500'>Add, edit ya delete category.</p>
        </div>
        <button type='button' onClick={openCreate} className={primaryBtnClass}>
          <span className='material-symbols-outlined text-lg'>add</span>
          Add Category
        </button>
      </div>

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
          Koi category nahi hai. "Add Category" se pehli category banayein.
        </div>
      ) : (
        <div className='overflow-x-auto rounded-2xl border border-orange-100'>
          <table className='w-full min-w-[620px] text-left text-sm'>
            <thead className='bg-orange-50/70 text-xs uppercase tracking-wide text-slate-500'>
              <tr>
                <th className='px-4 py-3'>Image</th>
                <th className='px-4 py-3'>Name</th>
                <th className='px-4 py-3'>Description</th>
                <th className='px-4 py-3'>Status</th>
                <th className='px-4 py-3 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-orange-50'>
              {items.map((item) => (
                <tr key={item._id} className='align-middle'>
                  <td className='px-4 py-3'>
                    <div className='h-12 w-12 overflow-hidden rounded-lg bg-orange-50'>
                      {item.image ? (
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
                  <td className='max-w-[280px] truncate px-4 py-3 text-slate-500'>
                    {item.description || '—'}
                  </td>
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
                        disabled={deletingId === item._id || productCount(item._id) > 0}
                        title={
                          productCount(item._id) > 0
                            ? 'Is category me products hain - pehle unhe delete ya move karein'
                            : 'Delete category'
                        }
                        className='inline-flex items-center gap-1 rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50'
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
        title={editing ? 'Edit Category' : 'Add Category'}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className={labelClass} htmlFor='cat-name'>
              Name <span className='text-red-500'>*</span>
            </label>
            <input
              id='cat-name'
              name='name'
              value={form.name}
              onChange={handleChange}
              placeholder='e.g. Fast Food'
              className={inputClass}
            />
            <FieldError>{fieldError}</FieldError>
          </div>

          <div>
            <label className={labelClass} htmlFor='cat-desc'>
              Description
            </label>
            <textarea
              id='cat-desc'
              name='description'
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder='Short description (optional)'
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor='cat-image'>
              Image
            </label>
            <div className='flex items-center gap-4'>
              <div className='h-16 w-16 overflow-hidden rounded-xl border border-orange-100 bg-orange-50'>
                {preview ? (
                  <img src={imageUrl(preview)} alt='Preview' className='h-full w-full object-cover' />
                ) : (
                  <div className='grid h-full w-full place-items-center text-brand'>
                    <span className='material-symbols-outlined'>image</span>
                  </div>
                )}
              </div>
              <input
                id='cat-image'
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
              {saving ? 'Saving...' : editing ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
