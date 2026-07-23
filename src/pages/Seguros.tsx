import { Link } from 'react-router-dom'
import { Shield, Home, Heart, Building2, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function LogoImg({ domain, name, size = 28 }: { domain: string; name: string; size?: number }) {
  return (
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt={name}
      width={size}
      height={size}
      className="object-contain"
      style={{ maxHeight: size }}
      onError={e => {
        const el = e.currentTarget
        el.style.display = 'none'
        const span = document.createElement('span')
        span.className = 'font-jakarta font-bold text-navy text-xs'
        span.textContent = name
        el.parentElement?.appendChild(span)
      }}
    />
  )
}

const PRODUCTOS = [
  {
    icon: Shield,
    name: 'Seguro de Impago de Alquiler',
    partner: 'SEAG',
    desc: 'Protege tu renta si el inquilino deja de pagar. Cubre hasta 12 meses de renta impagada más gastos de desahucio y defensa jurídica.',
  },
  {
    icon: Home,
    name: 'Seguro de Hogar',
    partner: 'MAPFRE',
    desc: 'Cobertura completa del continente y contenido de tu vivienda. Daños por agua, incendio, robo y responsabilidad civil.',
  },
  {
    icon: Heart,
    name: 'Seguro de Vida Vinculado',
    partner: 'MAPFRE',
    desc: 'Obligatorio en muchas hipotecas, pero no tienes que contratarlo con el banco. Comparamos y encontramos la mejor prima para tu perfil.',
  },
  {
    icon: Building2,
    name: 'Seguro de Comunidad',
    partner: '',
    desc: 'Para comunidades de propietarios que necesitan cobertura de elementos comunes, ascensores y responsabilidad civil.',
  },
]

const PARTNERS = [
  {
    name: 'SEAG',
    domain: 'seag.es',
    desc: 'Especialistas en seguros de impago de alquiler. Cobertura de rentas impagadas, gastos jurídicos y protección frente a actos vandálicos del inquilino.',
  },
  {
    name: 'MAPFRE',
    domain: 'mapfre.es',
    desc: 'Una de las aseguradoras líderes en España. Seguros de hogar, vida, defensa jurídica y multirriesgo para todo tipo de inmuebles.',
  },
]

const RAZONES = [
  {
    num: '01',
    title: 'Sin coste de intermediación',
    desc: 'Gestionamos tu seguro sin sobrecoste. Accedes al mismo precio que si lo contrataras directamente, con el valor añadido de nuestro asesoramiento.',
  },
  {
    num: '02',
    title: 'Seguros pensados para propietarios',
    desc: 'No todos los seguros de hogar son iguales. Los que gestionamos están diseñados para proteger activos en alquiler y situaciones específicas de inversión.',
  },
  {
    num: '03',
    title: 'Un solo interlocutor',
    desc: 'Trato directo conmigo para cualquier gestión, renovación o siniestro. Sin call centers ni pólizas que no entiendes.',
  },
]

export default function Seguros() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F6F2' }}>
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="pt-20" style={{ background: '#0D1F3C' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <div className="max-w-2xl">
            <p className="label mb-4" style={{ color: '#C49A3C' }}>Seguros · qimmo</p>
            <h1 className="h1 text-white mb-5">
              Protege tu patrimonio con las mejores coberturas.
            </h1>
            <p className="font-inter text-lg leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Como colaboradores de SEAG y MAPFRE, accedemos a seguros específicos para propietarios, compradores e inquilinos — negociados al mejor precio del mercado.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="px-6 py-4 rounded-xl text-center"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
                <p className="font-jakarta font-black text-2xl mb-0.5" style={{ color: '#C49A3C' }}>0€ impagos</p>
                <p className="font-inter text-xs uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>con seguro</p>
              </div>
              <div className="px-6 py-4 rounded-xl text-center"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
                <p className="font-jakarta font-black text-2xl mb-0.5" style={{ color: '#C49A3C' }}>Cobertura</p>
                <p className="font-inter text-xs uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>desde el día 1</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCTOS ─────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#F7F6F2' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-12">
            <p className="label mb-4">Coberturas</p>
            <h2 className="h2 text-navy">¿Qué seguros gestionamos?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PRODUCTOS.map((p, i) => (
              <div key={i} className="card flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: '#F0F4FA' }}>
                    <p.icon size={18} style={{ color: '#0D1F3C' }} />
                  </div>
                  <div>
                    <p className="font-jakarta font-bold text-navy text-sm mb-0.5">{p.name}</p>
                    {p.partner && (
                      <p className="font-inter text-xs font-semibold uppercase tracking-wide" style={{ color: '#C49A3C' }}>{p.partner}</p>
                    )}
                  </div>
                </div>
                <p className="font-inter text-sm leading-relaxed" style={{ color: '#4B5563' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNERS ──────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-12 text-center">
            <p className="label mb-4">Partners</p>
            <h2 className="h2 text-navy">Nuestros partners aseguradores</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {PARTNERS.map(partner => (
              <div key={partner.name} className="card flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
                    style={{ background: '#F7F6F2', border: '1px solid #E2E0DA' }}>
                    <LogoImg domain={partner.domain} name={partner.name} size={36} />
                  </div>
                  <div>
                    <p className="font-jakarta font-bold text-navy text-lg">{partner.name}</p>
                    <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-inter font-semibold uppercase tracking-wide"
                      style={{ background: '#F0F4FA', color: '#C49A3C', border: '1px solid #E2E0DA' }}>
                      <Shield size={9} />
                      Colaborador oficial
                    </span>
                  </div>
                </div>
                <p className="font-inter text-sm leading-relaxed" style={{ color: '#4B5563' }}>{partner.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POR QUÉ ───────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#F7F6F2' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-12">
            <p className="label mb-4">Por qué elegirnos</p>
            <h2 className="h2 text-navy">Lo que nos diferencia</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {RAZONES.map(r => (
              <div key={r.num} className="flex flex-col gap-4">
                <span className="font-jakarta font-black text-5xl leading-none" style={{ color: '#E2E0DA' }}>{r.num}</span>
                <p className="font-jakarta font-bold text-navy text-base">{r.title}</p>
                <p className="font-inter text-sm leading-relaxed" style={{ color: '#6B7280' }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#0D1F3C' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <p className="label mb-4" style={{ color: '#C49A3C' }}>Consulta gratuita</p>
          <h2 className="h2 text-white mb-4">¿Qué seguro necesitas?</h2>
          <p className="font-inter mb-8 max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Cuéntame tu situación y te recomiendo la cobertura más adecuada para tu inmueble o inversión.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="tel:+34609019160" className="btn-primary" style={{ background: '#C49A3C', borderColor: '#C49A3C' }}>
              609 019 160 <ArrowRight size={15} />
            </a>
            <Link to="/contacto"
              className="btn-outline"
              style={{ borderColor: 'rgba(255,255,255,0.25)', color: 'white' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
              Escribir mensaje
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
