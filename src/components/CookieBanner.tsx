import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'

const KEY = 'qimmo_cookie_consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem(KEY, 'accepted')
    setVisible(false)
  }

  const reject = () => {
    localStorage.setItem(KEY, 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 md:px-6 md:pb-6"
      role="dialog"
      aria-label="Aviso de cookies"
    >
      <div
        className="max-w-3xl mx-auto rounded-2xl shadow-2xl px-6 py-5 flex flex-col md:flex-row md:items-center gap-4"
        style={{ background: '#0D1F3C', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex-1">
          <p className="font-jakarta font-bold text-white text-sm mb-1">Este sitio usa cookies</p>
          <p className="font-inter text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Usamos cookies técnicas (necesarias) y analíticas (opcionales, Google Analytics) para mejorar tu experiencia.{' '}
            <Link to="/politica-cookies" className="underline" style={{ color: 'rgba(255,255,255,0.70)' }}>
              Saber más
            </Link>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={reject}
            className="px-4 py-2 rounded-lg text-xs font-inter font-medium transition-colors"
            style={{ color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'white' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}
          >
            Solo necesarias
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 rounded-lg text-xs font-inter font-semibold transition-colors"
            style={{ background: '#C49A3C', color: 'white' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#b08a30' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#C49A3C' }}
          >
            Aceptar todas
          </button>
          <button
            onClick={reject}
            className="p-1.5 rounded-lg transition-colors md:hidden"
            style={{ color: 'rgba(255,255,255,0.40)' }}
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
