import { ArrowRight, CheckCircle, Phone } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Alquilar() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="h-[64px]" />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="pt-20 pb-28 relative overflow-hidden" style={{ background: '#0D1F3C' }}>
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.05]"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1920&q=80')" }} />
        <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div>
              <p className="label text-white/35 mb-5">Alquilar tu propiedad</p>
              <h1 className="font-cormorant font-semibold text-white leading-tight mb-6"
                style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', lineHeight: 1.08 }}>
                Tus rentas, seguras.<br />
                <span style={{ color: '#C49A3C' }} className="italic">Sin preocupaciones.</span>
              </h1>
              <p className="text-white/55 font-inter text-[15px] leading-relaxed mb-10 max-w-md">
                Nos encargamos de todo: encontrar al inquilino adecuado, redactar el contrato,
                cobrar la renta mensual y gestionar cualquier incidencia.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a href="#gestion" className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-inter font-semibold text-sm transition-all" style={{ background: '#C49A3C', color: '#0D1F3C' }}>
                  Hablar con un consultor <ArrowRight size={14} />
                </a>
                <a href="tel:+34609019160"
                  className="inline-flex items-center gap-2 text-white/50 hover:text-white font-inter text-sm transition-colors duration-200">
                  <Phone size={13} /> 609 019 160
                </a>
              </div>
            </div>

            {/* Right — key points */}
            <div className="space-y-3">
              {[
                { n: '01', t: 'Seleccionamos inquilinos con verificación de solvencia, CIRBE y referencias.' },
                { n: '02', t: 'Contrato redactado por nuestro equipo legal. Sin cláusulas que te perjudiquen.' },
                { n: '03', t: 'Cobro mensual, resolución de incidencias y comunicación directa con el inquilino.' },
                { n: '04', t: 'Opciones de seguro de impago. Tu renta garantizada pase lo que pase.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 px-5 py-4 rounded-xl border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
                  <span className="font-inter font-black text-[11px] tracking-wider shrink-0 mt-0.5" style={{ color: '#C49A3C' }}>{item.n}</span>
                  <p className="text-white/65 text-sm font-inter leading-relaxed">{item.t}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────── */}
      <section className="border-b border-slate-100 py-16">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-3 divide-x divide-slate-100 max-w-2xl mx-auto">
            {[
              { val: '200+',    label: 'Propiedades en gestión', sub: 'en el área de Barcelona' },
              { val: '12 días', label: 'Para ocupar el piso',    sub: 'tiempo medio con inquilino' },
              { val: '0%',      label: 'Impagos con seguro',     sub: 'cobertura total de renta' },
            ].map((s, i) => (
              <div key={i} className="text-center px-6">
                <p className="font-inter font-black text-navy tabular-nums mb-1.5"
                  style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}>{s.val}</p>
                <p className="font-inter font-semibold text-navy text-[11px] uppercase tracking-wider mb-0.5">{s.label}</p>
                <p className="text-slate-400 text-[11px] font-inter">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNER REFORMA ── */}
<section className="py-16 bg-white">
  <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div>
        <p className="label mb-3">Pon el inmueble a punto</p>
        <h2 className="h2 text-navy mb-4">
          Un piso bien preparado se alquila antes — y mejor.
        </h2>
        <p className="font-inter text-base leading-relaxed mb-6" style={{ color: '#4B5563' }}>
          A veces la diferencia entre alquilar en 12 días o en 3 meses es una mano de pintura, unos suelos nuevos o una cocina actualizada. Como colaboradores de <strong>Servei Estació</strong> — entre otros reformistas de confianza — conectamos a nuestros propietarios con profesionales que pueden poner tu inmueble en su mejor versión antes de salir al mercado, con precios negociados y plazos rápidos.
        </p>
        <div className="space-y-3 mb-8">
          {[
            'Pintura, suelos, azulejos y carpintería',
            'Reformas de baño y cocina en tiempo récord',
            'Presupuesto en 48h, sin compromiso',
            'Coordinación completa incluida en el servicio qimmo',
          ].map(item => (
            <div key={item} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#C49A3C' }} />
              <p className="font-inter text-sm" style={{ color: '#4B5563' }}>{item}</p>
            </div>
          ))}
        </div>
        <a href="/contacto" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-inter font-semibold text-sm transition-all" style={{ background: '#0D1F3C', color: 'white' }}>
          Hablar sobre mi inmueble
        </a>
      </div>
      <div className="rounded-2xl p-8" style={{ background: '#F7F6F2', border: '1px solid #E2E0DA' }}>
        <p className="font-inter text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: '#9CA3AF' }}>Partners reformistas</p>
        <div className="space-y-4">
          {[
            { name: 'Servei Estació', domain: 'serveiestacio.com', role: 'Bricolaje y reformas integrales' },
            { name: 'Otros colaboradores', domain: '', role: 'Red de reformistas locales de confianza' },
          ].map(p => (
            <div key={p.name} className="flex items-center gap-4 p-4 rounded-xl bg-white" style={{ border: '1px solid #E2E0DA' }}>
              {p.domain ? (
                <img src={`https://logo.clearbit.com/${p.domain}`} alt={p.name} width={28} height={28} className="object-contain shrink-0"
                  onError={e => { e.currentTarget.style.display = 'none' }} />
              ) : (
                <div className="w-7 h-7 rounded-md shrink-0 flex items-center justify-center" style={{ background: '#E2E0DA' }}>
                  <span className="font-inter font-bold text-[10px]" style={{ color: '#9CA3AF' }}>+</span>
                </div>
              )}
              <div>
                <p className="font-jakarta font-bold text-sm text-navy">{p.name}</p>
                <p className="font-inter text-xs" style={{ color: '#9CA3AF' }}>{p.role}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="font-inter text-xs mt-4" style={{ color: '#9CA3AF' }}>
          Seleccionamos colaboradores por calidad de trabajo y puntualidad, no por precio.
        </p>
      </div>
    </div>
  </div>
</section>

      {/* ── MODALIDADES ───────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-10 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="label mb-3">Nuestro servicio</p>
            <div className="w-7 h-[2px] bg-gold mb-5" />
            <h2 className="h2 leading-tight">Elige cómo<br /><span className="text-gold italic">quieres gestionar</span></h2>
            <p className="text-slate-500 font-inter text-sm leading-relaxed mt-4">
              Tanto si solo quieres publicar y captar inquilino, como si prefieres que nos ocupemos de absolutamente todo.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            {[
              {
                title: 'Solo publicación',
                price: '1 mes de renta',
                sub: 'pago único al firmar el contrato',
                features: [
                  'Valoración de precio de mercado',
                  'Reportaje fotográfico profesional',
                  'Publicación en portales premium',
                  'Selección y verificación del inquilino',
                  'Redacción del contrato de arrendamiento',
                  'Inventario del inmueble',
                ],
                highlight: false,
              },
              {
                title: 'Gestión completa',
                price: '8% mensual',
                sub: 'sobre la renta, sin costes fijos',
                features: [
                  'Todo lo anterior incluido',
                  'Cobro y liquidación mensual',
                  'Gestión de incidencias y reparaciones',
                  'Comunicación continua con el inquilino',
                  'Renovaciones y actualización de renta',
                  'Acceso a seguro de impago incluido',
                ],
                highlight: true,
              },
            ].map((m, i) => (
              <div key={i} className={`rounded-2xl p-7 flex flex-col gap-6 ${
                m.highlight
                  ? 'bg-navy text-white'
                  : 'bg-white border border-slate-200'
              }`}>
                {m.highlight && (
                  <span className="self-start bg-gold/20 text-gold text-[10px] font-inter font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
                    Más elegido
                  </span>
                )}
                <div>
                  <p className={`font-inter font-semibold text-xs uppercase tracking-wider mb-3 ${
                    m.highlight ? 'text-white/40' : 'text-slate-400'
                  }`}>{m.title}</p>
                  <p className={`font-inter font-black tabular-nums mb-1 ${
                    m.highlight ? 'text-gold' : 'text-navy'
                  }`} style={{ fontSize: '1.8rem' }}>{m.price}</p>
                  <p className={`font-inter text-xs ${m.highlight ? 'text-white/40' : 'text-slate-400'}`}>{m.sub}</p>
                </div>
                <div className="space-y-2.5 flex-1">
                  {m.features.map((f, j) => (
                    <div key={j} className="flex items-start gap-2.5">
                      <CheckCircle size={13} className={`shrink-0 mt-0.5 ${m.highlight ? 'text-gold' : 'text-navy'}`} />
                      <p className={`text-xs font-inter leading-relaxed ${m.highlight ? 'text-white/70' : 'text-slate-600'}`}>{f}</p>
                    </div>
                  ))}
                </div>
                <a href="#gestion"
                  className={`w-full text-center py-3 rounded-xl font-inter font-semibold text-sm transition-all duration-200 ${
                    m.highlight
                      ? 'bg-gold text-navy hover:bg-gold-light'
                      : 'border-2 border-navy text-navy hover:bg-navy hover:text-white'
                  }`}>
                  Empezar
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ───────────────────────────────────────────────── */}
      <section className="bg-slate-50 py-20 border-y border-slate-100">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="w-8 h-[2px] bg-gold mx-auto mb-8" />
          <blockquote className="font-cormorant font-semibold text-navy italic leading-snug mb-6"
            style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
            "Llevamos tres pisos con qimmo. En ninguno hemos tenido un solo mes de impago
            y las incidencias se resuelven antes de que nos enteremos."
          </blockquote>
          <p className="font-inter text-slate-400 text-sm tracking-wide">— Jordi P., propietario con 3 inmuebles en gestión</p>
        </div>
      </section>

      {/* ── POR QUÉ CONFIAR ───────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-10 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="label mb-3">Tu tranquilidad</p>
            <div className="w-7 h-[2px] bg-gold mb-5" />
            <h2 className="h2 leading-tight">Protegemos<br /><span className="text-gold italic">tu inversión</span></h2>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              {
                title: 'Solo te presentamos inquilinos que hemos verificado nosotros',
                body:  'Consultamos el fichero de morosos, pedimos las últimas tres nóminas o declaración de renta, referencias de propietarios anteriores y realizamos una entrevista personal. Si no pasa el filtro, no llega a ti.',
              },
              {
                title: 'Tu contrato, blindado desde el primer día',
                body:  'Nuestro equipo legal redacta cada contrato específicamente para tu inmueble y tu inquilino. Incluimos todas las cláusulas necesarias para protegerte en caso de impago, desperfectos o resolución anticipada.',
              },
              {
                title: 'Las incidencias son nuestro problema, no el tuyo',
                body:  'Si hay una avería, una queja del vecino o cualquier comunicación del inquilino, nosotros lo gestionamos. Tú recibirás un resumen mensual, pero no necesitarás estar pendiente.',
              },
              {
                title: 'Tu renta, aunque el inquilino no pague',
                body:  'Trabajamos con los mejores seguros de impago del mercado. Si contratas nuestra gestión completa, incluimos la posibilidad de asegurar hasta 12 meses de renta y los gastos legales de un eventual desahucio.',
              },
            ].map((item, i) => (
              <div key={i} className="py-8 first:pt-0 last:pb-0 grid grid-cols-[32px_1fr] gap-5 items-start">
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <span className="font-inter font-black text-gold text-[10px]">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div>
                  <h3 className="font-inter font-bold text-navy text-sm mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm font-inter leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACTO DIRECTO ──────────────────────────────────────────── */}
      <section id="gestion" className="py-24 relative overflow-hidden" style={{ background: '#0D1F3C' }}>
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="relative z-10 max-w-xl">
            {/* Contacto directo — formulario oculto de momento */}
            <div className="card space-y-4 p-6">
              <p className="font-jakarta font-bold text-lg" style={{ color: '#0D1F3C' }}>
                ¿Hablamos?
              </p>
              <p className="font-inter text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                Cuéntame tu caso directamente. Sin formularios intermedios.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a href="tel:+34609019160" className="btn-primary">
                  609 019 160
                </a>
                <a href="https://wa.me/34609019160" target="_blank" rel="noopener noreferrer" className="btn-outline">
                  WhatsApp
                </a>
                <a href="mailto:info@qimmo.es" className="btn-outline">
                  info@qimmo.es
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
