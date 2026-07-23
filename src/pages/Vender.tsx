import { useState } from 'react'
import { Phone, ArrowRight, CheckCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Vender() {
  const [form, setForm] = useState({ nombre: '', telefono: '', email: '', direccion: '', cp: '', ciudad: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '38467395-6375-4e14-ba16-dd4ad72c98ba',
          subject: `Nueva solicitud de valoración — ${form.nombre}`,
          from_name: 'qimmo.es',
          nombre: form.nombre,
          telefono: form.telefono,
          email: form.email,
          direccion: form.direccion,
          codigo_postal: form.cp,
          ciudad: form.ciudad,
        }),
      })
      setSent(true)
    } finally {
      setSending(false)
    }
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="h-[64px]" />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="pt-20 pb-28 relative overflow-hidden" style={{ background: '#0D1F3C' }}>
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.05]"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1920&q=80')" }} />
        <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div>
              <p className="label text-white/35 mb-5">Vender tu propiedad</p>
              <h1 className="font-cormorant font-semibold text-white leading-tight mb-6"
                style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', lineHeight: 1.08 }}>
                Vendemos todo tipo<br />
                <span style={{ color: '#C49A3C' }} className="italic">de inmueble.</span>
              </h1>
              <p className="text-white/55 font-inter text-[15px] leading-relaxed mb-6 max-w-md">
                Viviendas, locales, oficinas y naves. Con o sin inquilinos. Lo que más nos importa no es el inmueble — es que tú, como propietario, no pierdas el tiempo con compradores que no pueden cerrar la operación.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {['Viviendas', 'Locales comerciales', 'Con inquilino', 'Sin inquilino', 'Naves'].map(tag => (
                  <span key={tag} className="px-3 py-1.5 rounded-lg border font-inter text-xs" style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}>{tag}</span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <a href="#valoracion" className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-inter font-semibold text-sm transition-all" style={{ background: '#C49A3C', color: '#0D1F3C' }}>
                  Valoración gratuita <ArrowRight size={14} />
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
                { n: '01', t: 'Valoración honesta, sin inflar el precio para captarte.' },
                { n: '02', t: 'Verificamos la solvencia del comprador antes de que pongas un pie en notaría.' },
                { n: '03', t: 'Gestionamos la financiación del comprador. Si necesita hipoteca, la tramitamos nosotros.' },
                { n: '04', t: 'Te acompañamos hasta notaría. Sin sorpresas, sin tiempo perdido.' },
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
              { val: '150+',    label: 'Inmuebles vendidos',    sub: 'en el área de Barcelona' },
              { val: '98%',     label: 'Del precio solicitado', sub: 'precio medio conseguido' },
              { val: '45 días', label: 'De media',              sub: 'desde encargo hasta firma' },
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

      {/* ── POR QUÉ QIMMO ─────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-10 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="label mb-3">Por qué qimmo</p>
            <div className="w-7 h-[2px] bg-gold mb-5" />
            <h2 className="h2 leading-tight">Un servicio<br /><span className="text-gold italic">a tu medida</span></h2>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              {
                title: 'Te decimos cuánto vale tu piso, de verdad',
                body:  'Analizamos operaciones cerradas en tu zona, no precios de lista. Te damos un número real con el que podemos trabajar — no uno inflado para que nos elijas y luego bajarlo.',
              },
              {
                title: 'El comprador llega con la financiación resuelta',
                body:  'Este es uno de los puntos que más tiempo hace perder a los propietarios: el comprador interesado que al final no consigue hipoteca. En qimmo gestionamos la financiación del comprador desde el principio. Si necesita hipoteca, la tramitamos nosotros antes de firmar arras. Así sabes que la operación va a cerrarse.',
              },
              {
                title: 'Compradores activos, no curiosos',
                body:  'Tenemos compradores con capacidad económica verificada buscando activos en Barcelona. En muchos casos presentamos el inmueble a nuestra red antes de publicarlo en portales.',
              },
              {
                title: 'Trato directo, siempre la misma persona',
                body:  'No hay equipo que te pase el teléfono. Hablas conmigo el primer día y el día de la firma. Y en todo lo que hay en medio.',
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

      {/* ── TESTIMONIAL ───────────────────────────────────────────────── */}
      <section className="bg-slate-50 py-20 border-y border-slate-100">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="w-8 h-[2px] bg-gold mx-auto mb-8" />
          <blockquote className="font-cormorant font-semibold text-navy italic leading-snug mb-6"
            style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
            "Vendimos en 38 días por encima del precio que esperábamos.
            El proceso fue completamente transparente, sin ninguna sorpresa."
          </blockquote>
          <p className="font-inter text-slate-400 text-sm tracking-wide">— Ana M. y Carlos F., propietarios en Eixample</p>
        </div>
      </section>

      {/* ── PROCESO ───────────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-10 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="label mb-3">Cómo funciona</p>
            <div className="w-7 h-[2px] bg-gold mb-5" />
            <h2 className="h2 leading-tight">Del encargo<br /><span className="text-gold italic">a la firma</span></h2>
            <p className="text-slate-500 font-inter text-sm leading-relaxed mt-4">
              Cuatro fases claras. En cada una sabrás qué está pasando y qué viene a continuación.
            </p>
          </div>
          <div className="space-y-0">
            {[
              { n: '01', title: 'Valoración gratuita',       time: '24 h',       desc: 'Análisis comparativo de mercado y valoración profesional. Te explicamos el precio, por qué ese número y cuál es la mejor estrategia.' },
              { n: '02', title: 'Preparación del inmueble',   time: '3–5 días',   desc: 'Fotografía profesional, home staging si aplica, certificado energético y toda la documentación necesaria. Tu propiedad en su mejor versión.' },
              { n: '03', title: 'Comercialización activa',    time: 'Semanas 1–6', desc: 'Publicación en portales premium, difusión en nuestra red de compradores activos y operaciones off-market. Visitas filtradas y coordinadas por nosotros.' },
              { n: '04', title: 'Negociación y escritura',    time: 'Cierre',      desc: 'Gestionamos las ofertas y negociamos en tu nombre. Si el comprador necesita hipoteca, la tramitamos con nuestros partners financieros antes de firmar arras. Tú llegas a notaría con todo cerrado.' },
            ].map((step, i, arr) => (
              <div key={i} className="flex gap-6 relative">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center z-10">
                    <span className="font-inter font-black text-white text-[10px] tracking-wider">{step.n}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="w-px flex-1 bg-slate-100" style={{ minHeight: '40px' }} />
                  )}
                </div>
                <div className={`pb-10 flex-1 ${i === arr.length - 1 ? 'pb-0' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-inter font-bold text-navy text-sm">{step.title}</h3>
                    <span className="text-[10px] font-inter font-medium text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full shrink-0 ml-3">
                      {step.time}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm font-inter leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORMULARIO VALORACIÓN ─────────────────────────────────────── */}
      <section id="valoracion" className="py-24" style={{ background: '#0D1F3C' }}>
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Texto */}
            <div>
              <p className="text-xs font-inter font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: '#C49A3C' }}>Valoración gratuita</p>
              <h2 className="h2 text-white mb-4">¿Cuánto vale<br />tu inmueble?</h2>
              <p className="font-inter leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '15px' }}>
                Déjame tus datos y en menos de 24 horas te contacto personalmente con una valoración real basada en operaciones cerradas en tu zona — no en precios de lista.
              </p>
            </div>

            {/* Formulario */}
            <div>
              {sent ? (
                <div className="flex flex-col items-center justify-center text-center py-12 gap-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(196,154,60,0.15)' }}>
                    <CheckCircle size={26} style={{ color: '#C49A3C' }} />
                  </div>
                  <p className="font-jakarta font-bold text-xl text-white">¡Recibido!</p>
                  <p className="font-inter text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    En breves recibirás tu valoración. Si es urgente, llámame al <a href="tel:+34609019160" className="underline text-white">609 019 160</a>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Nombre */}
                  <input
                    required type="text" placeholder="Nombre *"
                    value={form.nombre} onChange={set('nombre')}
                    className="w-full px-4 py-3 rounded-lg font-inter text-sm outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }}
                    onFocus={e => e.currentTarget.style.borderColor = '#C49A3C'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                  />
                  {/* Teléfono + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { k: 'telefono' as const, ph: 'Teléfono *', type: 'tel', req: true },
                      { k: 'email'    as const, ph: 'Email *',    type: 'email', req: true },
                    ].map(({ k, ph, type, req }) => (
                      <input
                        key={k} required={req} type={type} placeholder={ph}
                        value={form[k]} onChange={set(k)}
                        className="w-full px-4 py-3 rounded-lg font-inter text-sm outline-none transition-all"
                        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }}
                        onFocus={e => e.currentTarget.style.borderColor = '#C49A3C'}
                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                      />
                    ))}
                  </div>
                  {/* Dirección */}
                  <input
                    required type="text" placeholder="Dirección del inmueble *"
                    value={form.direccion} onChange={set('direccion')}
                    className="w-full px-4 py-3 rounded-lg font-inter text-sm outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }}
                    onFocus={e => e.currentTarget.style.borderColor = '#C49A3C'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                  />
                  {/* CP + Ciudad */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { k: 'cp'     as const, ph: 'Código postal *' },
                      { k: 'ciudad' as const, ph: 'Ciudad *' },
                    ].map(({ k, ph }) => (
                      <input
                        key={k} required type="text" placeholder={ph}
                        value={form[k]} onChange={set(k)}
                        className="w-full px-4 py-3 rounded-lg font-inter text-sm outline-none transition-all"
                        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }}
                        onFocus={e => e.currentTarget.style.borderColor = '#C49A3C'}
                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                      />
                    ))}
                  </div>
                  <button
                    type="submit" disabled={sending}
                    className="w-full py-3.5 rounded-lg font-jakarta font-bold text-sm transition-all flex items-center justify-center gap-2"
                    style={{ background: '#C49A3C', color: '#0D1F3C', opacity: sending ? 0.7 : 1 }}
                  >
                    {sending ? 'Enviando...' : <>Solicitar valoración gratuita <ArrowRight size={15} /></>}
                  </button>
                  <p className="text-center font-inter text-xs" style={{ color: 'rgba(255,255,255,0.30)' }}>
                    Sin compromiso. Te respondo en menos de 24 horas.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
