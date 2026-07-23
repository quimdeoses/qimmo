import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, TrendingUp, Users, Clock } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase, supabaseReady, type Propiedad } from '../lib/supabase'

const STATS = [
  { num: '+150',  label: 'Operaciones gestionadas' },
  { num: '+18',   label: 'Asesores liderados' },
  { num: '<30d',  label: 'Tiempo medio de venta' },
  { num: '6 años', label: 'En el sector' },
]

const SERVICIOS = [
  {
    titulo: 'Vender tu inmueble',
    desc: 'Te digo cuánto vale y cómo lo vendo. Sin rodeos. He transaccionado desde pisos de segunda mano hasta edificios completos, y sé exactamente qué funciona en el mercado de Barcelona.',
    href: '/vender',
    icon: TrendingUp,
  },
  {
    titulo: 'Alquilar tu activo',
    desc: 'Gestión completa: búsqueda de inquilino, negociación, contrato y seguimiento. Cubrimos alquiler residencial de larga duración y alquiler temporal.',
    href: '/alquilar',
    icon: Clock,
  },
  {
    titulo: 'Inversión y patrimonio',
    desc: 'Si buscas rentabilidad, lo analizamos juntos. He trabajado con family offices y patrimoniales. Locales, oficinas, parkings, edificios. Sé leer una inversión.',
    href: '/inversion',
    icon: Users,
  },
  {
    titulo: 'Sector terciario',
    desc: 'Locales comerciales, oficinas y naves industriales en Barcelona. Especializado en operaciones de acompañamiento a marcas en expansión y ubicaciones prime.',
    href: '/buscar',
    icon: MapPin,
  },
]

export default function Inicio() {
  const [featured, setFeatured] = useState<Propiedad[]>([])

  useEffect(() => {
    if (!supabaseReady) return
    supabase.from('propiedades').select('*').eq('publicado', true).order('created_at', { ascending: false }).limit(3)
      .then(({ data }) => setFeatured((data ?? []) as Propiedad[]))
  }, [])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F6F2' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section className="pt-20 relative overflow-hidden" style={{ background: '#0D1F3C' }}>
        {/* Foto integrada — fondo derecho */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[42%]">
          <img
            src="/quim.png"
            alt="Joaquín de Oses"
            className="w-full h-full object-cover object-top"
          />
          {/* Gradiente que funde la foto con el fondo navy */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to right, #0D1F3C 0%, rgba(13,31,60,0.4) 40%, transparent 70%)',
          }} />
          {/* Gradiente inferior */}
          <div className="absolute bottom-0 left-0 right-0 h-32" style={{
            background: 'linear-gradient(to top, #0D1F3C, transparent)',
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-36">
          <div className="max-w-xl">
            <p className="text-xs font-inter font-semibold uppercase tracking-[0.15em] mb-6" style={{ color: '#C49A3C' }}>
              Consultoría Inmobiliaria · Barcelona
            </p>
            <h1 className="h1 text-white mb-6">
              Primero las personas.<br />
              Luego las propiedades.
            </h1>
            <p className="font-inter text-lg leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.60)' }}>
              Soy Joaquín de Oses. Cada operación es distinta, cada cliente tiene una situación diferente. No trabajo con procesos estándar — trabajo contigo, entendiendo qué necesitas y diseñando la solución a medida.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/contacto" className="btn-primary" style={{ background: '#C49A3C', borderColor: '#C49A3C' }}>
                Hablamos <ArrowRight size={15} />
              </Link>
              <Link to="/buscar" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.25)', color: 'white' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                Ver propiedades
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ num, label }) => (
              <div key={label}>
                <p className="font-jakarta font-bold text-2xl text-white mb-0.5">{num}</p>
                <p className="text-xs font-inter" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUIÉN SOY ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <img
                src="/quim.png"
                alt="Joaquín de Oses"
                className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl object-cover object-top shrink-0"
                style={{ border: '3px solid #E2E0DA' }}
              />
              <div>
              <p className="label mb-4">Sobre mí</p>
              <h2 className="h2 text-navy mb-6">
                He estado en los dos lados de la mesa.
              </h2>
              <div className="space-y-4 font-inter text-base leading-relaxed" style={{ color: '#4B5563' }}>
                <p>
                  Empecé construyendo desde cero la división de compraventa de una agencia cuyo negocio principal era el alquiler. Puerta fría, llamada fría, 5 a 8 operaciones al mes adicionales en dos meses.
                </p>
                <p>
                  Después lideré la apertura de la primera tienda física de Housfy: un equipo de 18 personas, breakeven en 12 meses. Luego en Brickbro como Head of Sales: reestructuré el área comercial, creé los departamentos de alquiler y administración de fincas, y gestionamos una facturación combinada de 1,7 millones en 2024.
                </p>
                <p>
                  Ahora trabajo solo, de forma directa, porque así puedo garantizar la calidad que no siempre es posible en estructuras grandes.
                </p>
              </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Housfy Real Estate', role: 'Director de Oficina', years: '2021 – 2023' },
                { label: 'Brickbro',           role: 'Head of Sales',       years: '2023 – 2025' },
                { label: 'Finques Bon Dia',    role: 'Jefe de Ventas',      years: '2020 – 2021' },
                { label: 'Servei Estació',     role: 'Director Comercial',  years: '2025 – 2026' },
              ].map(({ label, role, years }) => (
                <div key={label} className="card">
                  <p className="font-jakarta font-bold text-sm text-navy mb-1">{label}</p>
                  <p className="font-inter text-xs font-medium mb-1" style={{ color: '#C49A3C' }}>{role}</p>
                  <p className="font-inter text-xs" style={{ color: '#9CA3AF' }}>{years}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICIOS ── */}
      <section className="py-20" style={{ background: '#F7F6F2' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-12">
            <p className="label mb-4">Servicios</p>
            <h2 className="h2 text-navy">¿En qué te puedo ayudar?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SERVICIOS.map(({ titulo, desc, href, icon: Icon }) => (
              <Link key={href} to={href} className="card group block">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#F0F4FA' }}>
                    <Icon size={16} style={{ color: '#0D1F3C' }} />
                  </div>
                  <h3 className="h3 text-navy">{titulo}</h3>
                </div>
                <p className="font-inter text-sm leading-relaxed mb-4" style={{ color: '#4B5563' }}>{desc}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-inter font-semibold transition-colors" style={{ color: '#C49A3C' }}>
                  Saber más <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── POR QUÉ QIMMO ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="label mb-4">Por qué qimmo</p>
              <h2 className="h2 text-navy mb-6">
                Lo que obtienes cuando trabajas conmigo.
              </h2>
              <Link to="/contacto" className="btn-primary">
                Empezamos <ArrowRight size={15} />
              </Link>
            </div>
            <div className="space-y-6">
              {[
                {
                  n: '01',
                  t: 'Traje a medida, no talla única',
                  d: 'Antes de hablar de propiedades, te escucho. Cada persona tiene una situación financiera, familiar y personal distinta. La solución viene después de entender eso.',
                },
                {
                  n: '02',
                  t: 'Trato directo, sin filtros',
                  d: 'No hay comerciales intermedios ni equipos que deleguen. Trabajas conmigo desde el primer día hasta el cierre. Eso cambia la calidad de lo que recibes.',
                },
                {
                  n: '03',
                  t: 'Rapidez sin perder rigor',
                  d: 'He conseguido rotar producto en menos de 30 días desde la captación. La velocidad no es suerte — es tener claro el proceso desde el primer momento.',
                },
                {
                  n: '04',
                  t: 'Residencial, terciario e inversión',
                  d: 'He operado en todos los segmentos: pisos, locales, oficinas, edificios, parkings. Si tienes un activo o buscas uno, entiendo el mercado desde dentro.',
                },
              ].map(({ n, t, d }) => (
                <div key={n} className="flex gap-5">
                  <span className="font-jakarta font-black text-2xl shrink-0 leading-none" style={{ color: '#E2E0DA' }}>{n}</span>
                  <div>
                    <p className="font-jakarta font-bold text-navy mb-1">{t}</p>
                    <p className="font-inter text-sm leading-relaxed" style={{ color: '#6B7280' }}>{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROPIEDADES DESTACADAS ── */}
      <section className="py-20" style={{ background: '#F7F6F2' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="label mb-3">Cartera</p>
              <h2 className="h2 text-navy">Algunas propiedades</h2>
            </div>
            <Link to="/buscar" className="btn-outline hidden md:inline-flex">
              Ver todas <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featured.map(p => (
              <Link key={p.id} to={`/buscar/${p.ref}`} className="prop-card block">
                <div className="relative">
                  <img src={p.imagen} alt={p.titulo} className="w-full h-52 object-cover" />
                  {p.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-inter font-bold uppercase tracking-wide"
                      style={{ background: '#0D1F3C', color: 'white' }}>
                      {p.badge}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-inter text-xs mb-1.5" style={{ color: '#9CA3AF' }}>{p.barrio} · {p.tipo}</p>
                  <p className="font-jakarta font-bold text-navy mb-2">{p.titulo}</p>
                  <p className="font-inter font-bold text-lg text-navy">
                    {p.precio.toLocaleString('es-ES')} €
                  </p>
                  {p.m2 && (
                    <p className="font-inter text-xs mt-1" style={{ color: '#9CA3AF' }}>
                      {p.m2} m²{p.habitaciones ? ` · ${p.habitaciones} hab.` : ''}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 md:hidden">
            <Link to="/buscar" className="btn-outline w-full justify-center">
              Ver todas las propiedades <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-20" style={{ background: '#0D1F3C' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <p className="label mb-4" style={{ color: '#C49A3C' }}>Contacto</p>
          <h2 className="h2 text-white mb-4">
            Cuéntame qué necesitas.
          </h2>
          <p className="font-inter mb-8 max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Sin formularios que no lee nadie. Te respondo personalmente en menos de 24 horas — y si es urgente, llámame.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/contacto" className="btn-primary" style={{ background: '#C49A3C' }}>
              Escribir un mensaje <ArrowRight size={15} />
            </Link>
            <a href="tel:+34609019160" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.25)', color: 'white' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
              Llamar: 609 019 160
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
