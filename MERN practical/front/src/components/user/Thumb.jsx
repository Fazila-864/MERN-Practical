// ===== Shared image thumb - missing/broken image pe placeholder dikhata hai =====
import { useState } from 'react'

export default function Thumb({ src, alt, className }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        className={`${className} bg-white grid place-content-center border border-black/5`}
      >
        <span className="material-symbols-outlined text-ink/25 text-3xl">
          image
        </span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`${className} object-cover`}
    />
  )
}
