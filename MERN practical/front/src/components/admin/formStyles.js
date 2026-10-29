import { IMAGE_BASE } from '../../services/api.js'

export const inputClass =
  'w-full rounded-xl border border-orange-100 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20'

export const labelClass = 'mb-1.5 block text-sm font-medium text-slate-700'

export const primaryBtnClass =
  'inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60'

export const secondaryBtnClass =
  'inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60'

export const imageUrl = (path) => {
  if (!path || path === 'null') return ''
  if (path instanceof File) return URL.createObjectURL(path)
  return IMAGE_BASE + '/' + String(path).replace(/^\/+/, '')
}
