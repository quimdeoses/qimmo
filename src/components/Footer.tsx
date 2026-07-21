import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ background: '#0D1F3C' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <img src="/LOGO QIMMO BLUE.png" alt="qimmo" className="h-8 w-auto" style={{ filter: 'brightness(0) invert(1)' }} />
            </Link>
            <p className="font-inter text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>
              Consultoría inmobiliaria en Barcelona. Especializado en residencial, sector terciario e inversión patrimonial.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Servicios
            </p>
            <div className="space-y-2.5">
              {[
                { label: 'Buscar propiedades', href: '/buscar' },
                { label: 'Vender',             href: '/vender' },
                { label: 'Alquilar',           href: '/alquilar' },
                { label: 'Inversión',          href: '/inversion' },
                { label: 'Calculadoras',       href: '/calculadoras' },
              ].map(({ label, href }) => (
                <Link key={href} to={href}
                  className="block text-sm font-inter transition-colors duration-200"
                  style={{ color: 'rgba(255,255,255,0.40)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.40)')}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contacto */}
          <div>
            <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Contacto
            </p>
            <div className="space-y-3">
              <a href="mailto:info@qimmo.es" className="flex items-center gap-2.5 text-sm font-inter transition-colors"
                style={{ color: 'rgba(255,255,255,0.40)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.40)')}>
                <Mail size={13} />
                info@qimmo.es
              </a>
              <a href="tel:+34609019160" className="flex items-center gap-2.5 text-sm font-inter transition-colors"
                style={{ color: 'rgba(255,255,255,0.40)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.40)')}>
                <Phone size={13} />
                609 019 160
              </a>
              <div className="flex items-start gap-2.5 text-sm font-inter" style={{ color: 'rgba(255,255,255,0.40)' }}>
                <MapPin size={13} className="mt-0.5 shrink-0" />
                Barcelona & Área Metropolitana
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="font-inter text-xs" style={{ color: 'rgba(255,255,255,0.20)' }}>
            © {new Date().getFullYear()} qimmo · Todos los derechos reservados
          </p>
          <a href="https://vivviatech.com" target="_blank" rel="noopener noreferrer"
            className="font-inter text-xs transition-colors"
            style={{ color: 'rgba(255,255,255,0.18)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.40)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.18)')}>
            Web por vivviatech.com
          </a>
        </div>
      </div>
    </footer>
  )
}
