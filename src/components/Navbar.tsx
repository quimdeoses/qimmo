import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const NAV = [
  { label: 'Buscar',    href: '/buscar' },
  { label: 'Vender',    href: '/vender' },
  { label: 'Alquilar',  href: '/alquilar' },
  { label: 'Inversión', href: '/inversion' },
  { label: 'Hipotecas', href: '/hipotecas' },
  { label: 'Seguros',   href: '/seguros' },
  { label: 'Blog',      href: '/blog' },
]

export default function Navbar() {
  const [open, setOpen]         = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname }            = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(247,246,242,0.97)' : 'white',
        borderBottom: '1px solid #E2E0DA',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">

        <Link to="/" className="flex items-center select-none">
          <img src="/LOGO QIMMO BLUE.png" alt="qimmo" className="h-16 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(({ label, href }) => (
            <Link
              key={href}
              to={href}
              className="px-4 py-2 rounded-md text-sm font-inter font-medium transition-colors duration-150"
              style={{
                color: pathname === href ? '#0D1F3C' : '#6B7280',
                background: pathname === href ? '#F0F4FA' : 'transparent',
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a href="tel:+34609019160" className="text-sm font-inter font-medium transition-colors" style={{ color: '#6B7280' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#0D1F3C')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}>
            609 019 160
          </a>
          <Link to="/contacto" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '13px' }}>
            Hablamos
          </Link>
        </div>

        <button
          className="md:hidden p-2 rounded-md transition-colors"
          style={{ color: '#6B7280' }}
          onClick={() => setOpen(v => !v)}
          aria-label="Menú"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-white" style={{ borderColor: '#E2E0DA' }}>
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
            {NAV.map(({ label, href }) => (
              <Link key={href} to={href}
                className="px-4 py-3 rounded-md text-sm font-inter font-medium transition-colors"
                style={{ color: '#4B5563' }}>
                {label}
              </Link>
            ))}
            <div className="mt-3 pt-3 flex flex-col gap-2" style={{ borderTop: '1px solid #E2E0DA' }}>
              <a href="tel:+34609019160" className="px-4 py-3 text-sm font-medium" style={{ color: '#6B7280' }}>609 019 160</a>
              <Link to="/contacto" className="btn-primary justify-center">Hablamos</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
