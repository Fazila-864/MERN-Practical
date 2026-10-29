export default function Modal({ open, title, onClose, children }) {
  if (!open) return null

  return (
    <div
      className='fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8'
      onMouseDown={onClose}
    >
      <div
        className='w-full max-w-xl rounded-2xl bg-white shadow-2xl'
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between border-b border-orange-100 px-6 py-4'>
          <h2 className='font-display text-xl font-semibold text-slate-900'>{title}</h2>
          <button
            type='button'
            onClick={onClose}
            className='grid h-9 w-9 place-items-center rounded-full text-slate-500 transition-colors hover:bg-orange-50 hover:text-brand'
            aria-label='Close'
          >
            <span className='material-symbols-outlined'>close</span>
          </button>
        </div>
        <div className='px-6 py-5'>{children}</div>
      </div>
    </div>
  )
}
