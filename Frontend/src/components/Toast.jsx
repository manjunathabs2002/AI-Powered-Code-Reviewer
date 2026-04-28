import { useEffect } from 'react'

export default function Toast({ id, message, type = 'info', onClose }) {
  useEffect(() => {
    const t = setTimeout(() => onClose(id), 6000)
    return () => clearTimeout(t)
  }, [id, onClose])

  return (
    <div className={`toast toast-${type}`} role="alert">
      {message}
      <button className="toast-close" onClick={() => onClose(id)}>×</button>
    </div>
  )
}
