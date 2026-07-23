import { useState } from 'react'
import { ArrowRight, ArrowLeft, CheckCircle, TrendingUp, Clock, Shield, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// ── Multi-step form ───────────────────────────────────────────────────────────
type Step = 1 | 2 | 3
interface FormData {
  nombre: string; telefono: string; email: string
  direccion: string; cp: string; ciudad: string; tipo: string
}
const EMPTY: FormData = { nombre: '', telefono: '', email: '', direccion: '', cp: '', ciudad: '', tipo: '' }
const TIPOS = ['Piso / Apartamento', 'Àtic / Àtico', 'Casa / Chalet', 'Local comercial', 'Oficina', 'Nave industrial', 'Edificio', 'Otro']

function ValoracionForm() {
  const [step, setStep]     = useState<Step>(1)
  const [form, setForm]     = useState<FormData>(EMPTY)
  const [sending, setSending] = useState(false)
  const [sent, setSent]     = useState(false)

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const step1Ok = form.nombre && form.telefono && form.email
  const step2Ok = form.direccion && form.cp && form.ciudad

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '38467395-6375-4e14-ba16-dd4ad72c98ba',
          subject: `Solicitud de valoración — ${form.nombre} · ${form.ciudad}`,
          from_name: 'qimmo.es',
          Nombre: form.nombre,
          Teléfono: form.telefono,
          Email: form.email,
          Dirección: form.direccion,
          'Código postal': form.cp,
          Ciudad: form.ciudad,
          'Tipo de inmueble': form.tipo || 'No especificado',
        }),
      })
      setSent(true)
    } finally {
      setSending(false)
    }
  }

  const inputCls = "w-full px-4 py-3.5 rounded-xl font-inter text-sm outline-none transition-all duration-200 bg-white border border-[#E2E0DA] text-navy placeholder-[#9CA3AF] focus:border-navy focus:ring-2 focus:ring-navy/10"

  if (sent) return (
    <div className="text-center py-10 flex flex-col items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
        <CheckCircle size={30} className="text-green-500" />
      </div>
      <div>
        <p className="font-jakarta font-bold text-xl text-navy mb-1">¡Solicitud recibida!</p>
        <p className="font-inter text-sm text-[#6B7280] max-w-xs">
          En menos de 24 horas te contacto personalmente con la valoración de tu inmueble.
        </p>
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit}>
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {([1,2,3] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-inter font-bold transition-all duration-300"
              style={{
                background: step >= s ? '#0D1F3C' : '#F0F4FA',
                color: step >= s ? 'white' : '#9CA3AF',
              }}
            >
              {step > s ? <CheckCircle size={14} /> : s}
            </div>
            <span className="text-xs font-inter hidden sm:block" style={{ color: step === s ? '#0D1F3C' : '#9CA3AF' }}>
              {['Tus datos','Tu inmueble','Confirmar'][i]}
            </span>
            {i < 2 && <div className="flex-1 h-px mx-1" style={{ background: step > s ? '#0D1F3C' : '#E2E0DA', width: '32px' }} />}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-3">
          <p className="font-jakarta font-bold text-navy text-base mb-4">¿Cómo te llamas?</p>
          <input required type="text" placeholder="Nombre y apellidos *" value={form.nombre} onChange={set('nombre')} className={inputCls} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input required type="tel"   placeholder="Teléfono *"  value={form.telefono} onChange={set('telefono')} className={inputCls} />
            <input required type="email" placeholder="Email *"     value={form.email}    onChange={set('email')}    className={inputCls} />
          </div>
          <button type="button" onClick={() => setStep(2)} disabled={!step1Ok}
            className="w-full py-3.5 rounded-xl font-jakarta font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: '#0D1F3C', color: 'white' }}>
            Continuar <ArrowRight size={15} />
          </button>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="space-y-3">
          <p className="font-jakarta font-bold text-navy text-base mb-4">¿Dónde está el inmueble?</p>
          <input required type="text" placeholder="Dirección completa *" value={form.direccion} onChange={set('direccion')} className={inputCls} />
          <div className="grid grid-cols-2 gap-3">
            <input required type="text" placeholder="Código postal *" value={form.cp}     onChange={set('cp')}     className={inputCls} />
            <input required type="text" placeholder="Ciudad *"        value={form.ciudad} onChange={set('ciudad')} className={inputCls} />
          </div>
          <select value={form.tipo} onChange={set('tipo')} className={inputCls} style={{ cursor: 'pointer' }}>
            <option value="">Tipo de inmueble (opcional)</option>
            {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)}
              className="px-5 py-3.5 rounded-xl font-inter font-medium text-sm flex items-center gap-2 transition-all border border-[#E2E0DA] text-[#6B7280] hover:border-navy hover:text-navy">
              <ArrowLeft size={14} /> Atrás
            </button>
            <button type="button" onClick={() => setStep(3)} disabled={!step2Ok}
              className="flex-1 py-3.5 rounded-xl font-jakarta font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: '#0D1F3C', color: 'white' }}>
              Continuar <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — resumen */}
      {step === 3 && (
        <div className="space-y-4">
          <p className="font-jakarta font-bold text-navy text-base mb-2">Confirma tus datos</p>
          <div className="rounded-xl border border-[#E2E0DA] divide-y divide-[#E2E0DA] text-sm font-inter">
            {[
              { l: 'Nombre',   v: form.nombre },
              { l: 'Teléfono', v: form.telefono },
              { l: 'Email',    v: form.email },
              { l: 'Inmueble', v: `${form.direccion}, ${form.cp} ${form.ciudad}` },
              ...(form.tipo ? [{ l: 'Tipo', v: form.tipo }] : []),
            ].map(({ l, v }) => (
              <div key={l} className="flex items-start justify-between px-4 py-3 gap-4">
                <span className="text-[#9CA3AF] shrink-0">{l}</span>
                <span className="text-navy font-medium text-right">{v}</span>
              </div>
            ))}
          </div>
          <p className="font-inter text-xs text-[#9CA3AF]">
            Al enviar aceptas nuestra{' '}
            <Link to="/politica-privacidad" target="_blank" className="underline hover:text-navy">política de privacidad</Link>.
          </p>
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(2)}
              className="px-5 py-3.5 rounded-xl font-inter font-medium text-sm flex items-center gap-2 transition-all border border-[#E2E0DA] text-[#6B7280] hover:border-navy hover:text-navy">
              <ArrowLeft size={14} /> Atrás
            </button>
            <button type="submit" disabled={sending}
              className="flex-1 py-3.5 rounded-xl font-jakarta font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200"
              style={{ background: '#C49A3C', color: '#0D1F3C', opacity: sending ? 0.7 : 1 }}>
              {sending ? 'Enviando...' : <>Solicitar valoración <ArrowRight size={15} /></>}
            </button>
          </div>
        </div>
      )}
    </form>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function Vender() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F6F2' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section className="pt-16 relative overflow-hidden" style={{ background: '#0D1F3C', minHeight: '520px' }}>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 80% at 100% 50%, rgba(196,154,60,0.07) 0%, transparent 70%)',
        }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-inter font-semibold uppercase tracking-[0.18em] mb-5" style={{ color: '#C49A3C' }}>
                Vender con qimmo
              </p>
              <h1 className="h1 text-white mb-6">
                Vende en el menor tiempo posible, al mejor precio.
              </h1>
              <p className="font-inter text-base leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Lo que más preocupa a un propietario no es solo el precio — es no perder el tiempo con compradores que al final no pueden cerrar. Por eso en qimmo verificamos la solvencia y gestionamos la financiación del comprador desde el primer momento.
              </p>
              <a href="#valoracion"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-jakarta font-bold text-sm transition-all duration-200"
                style={{ background: '#C49A3C', color: '#0D1F3C' }}>
                Solicitar valoración gratuita <ArrowRight size={15} />
              </a>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-3">
              {[
                { icon: TrendingUp, t: '+150',       s: 'Inmuebles gestionados' },
                { icon: Clock,      t: '< 45 días',  s: 'Tiempo medio de venta' },
                { icon: Shield,     t: '100%',       s: 'Compradores verificados' },
                { icon: Users,      t: 'Directo',    s: 'Siempre la misma persona' },
              ].map(({ icon: Icon, t, s }) => (
                <div key={s} className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Icon size={18} style={{ color: '#C49A3C' }} className="mb-3" />
                  <p className="font-jakarta font-bold text-white text-xl mb-0.5">{t}</p>
                  <p className="font-inter text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── POR QUÉ QIMMO ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-14">
            <p className="label mb-3">Por qué qimmo</p>
            <h2 className="h2 text-navy">Un servicio diseñado para que no pierdas ni tiempo ni dinero.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                n: '01',
                t: 'Valoración real, no inflada',
                d: 'Analizamos operaciones cerradas en tu zona, no precios de lista. Te damos un número con el que podemos trabajar desde el primer día — sin promesas vacías para que nos elijas.',
              },
              {
                n: '02',
                t: 'El comprador llega con la financiación resuelta',
                d: 'Este es el punto que más tiempo hace perder a los propietarios: el comprador interesado que al final no consigue hipoteca. En qimmo gestionamos la financiación del comprador desde el principio. Si necesita hipoteca, la tramitamos con nuestros partners bancarios antes de firmar arras.',
              },
              {
                n: '03',
                t: 'Compradores activos, no curiosos',
                d: 'Tenemos una base de compradores con capacidad económica verificada. En muchos casos presentamos el inmueble off-market antes de publicarlo en portales, ahorrando tiempo y exposición innecesaria.',
              },
              {
                n: '04',
                t: 'Trato directo. Siempre la misma persona.',
                d: 'No hay equipo que te pase el teléfono. Hablas conmigo el primer día y el día de la firma. Y en todo lo que hay en medio. Eso es lo que significa trabajar sin estructura innecesaria.',
              },
            ].map(({ n, t, d }) => (
              <div key={n} className="card group hover:border-navy/20">
                <span className="font-inter font-black text-xs tracking-wider mb-4 block" style={{ color: '#C49A3C' }}>{n}</span>
                <h3 className="font-jakarta font-bold text-navy text-base mb-2">{t}</h3>
                <p className="font-inter text-sm leading-relaxed" style={{ color: '#6B7280' }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTALES PREMIUM ── */}
<section className="py-16" style={{ background: '#F7F6F2' }}>
  <div className="max-w-7xl mx-auto px-6 lg:px-10">
    <div className="mb-10">
      <p className="label mb-3">Visibilidad máxima</p>
      <h2 className="h2 text-navy">Tu inmueble en los portales<br />más visitados de España.</h2>
      <p className="font-inter text-base mt-4 max-w-2xl" style={{ color: '#6B7280' }}>
        Publicamos tu propiedad en los portales con mayor tráfico cualificado: compradores activos, con capacidad real de compra. Sin extra de coste para ti.
      </p>
    </div>
    <div className="flex flex-wrap gap-4 items-center">
      {[
        { name: 'Idealista',    domain: 'idealista.com' },
        { name: 'Ya Encontré',  domain: 'yaencontre.com' },
        { name: 'Fotocasa',     domain: 'fotocasa.es' },
        { name: 'Habitaclia',   domain: 'habitaclia.com' },
        { name: 'Milanuncios',  domain: 'milanuncios.com' },
      ].map(p => (
        <div key={p.name}
          className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-white"
          style={{ border: '1px solid #E2E0DA' }}>
          <img
            src={`https://logo.clearbit.com/${p.domain}`}
            alt={p.name}
            width={22}
            height={22}
            className="object-contain"
            style={{ maxHeight: 22 }}
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
          <span className="font-inter font-semibold text-sm text-navy">{p.name}</span>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* ── PROCESO ── */}
      <section className="py-20" style={{ background: '#F7F6F2' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-14">
            <p className="label mb-3">Cómo funciona</p>
            <h2 className="h2 text-navy">Del encargo a la firma, sin sorpresas.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { n: '01', t: 'Valoración',          d: 'Análisis comparativo y precio real de mercado. Te lo explico en persona o por videollamada.' },
              { n: '02', t: 'Preparación',         d: 'Fotografía profesional, documentación y estrategia de precio. Tu inmueble en su mejor versión.' },
              { n: '03', t: 'Comercialización',    d: 'Presentación a compradores activos, difusión en portales premium y gestión de visitas filtradas.' },
              { n: '04', t: 'Cierre y notaría',   d: 'Gestionamos las ofertas, verificamos la solvencia del comprador y coordinamos la firma.' },
            ].map(({ n, t, d }, i, arr) => (
              <div key={n} className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-inter font-black text-xs text-white shrink-0"
                    style={{ background: '#0D1F3C' }}>{n}</div>
                  {i < arr.length - 1 && (
                    <div className="hidden md:block flex-1 h-px" style={{ background: '#E2E0DA' }} />
                  )}
                </div>
                <h3 className="font-jakarta font-bold text-navy text-sm mb-2">{t}</h3>
                <p className="font-inter text-sm leading-relaxed" style={{ color: '#6B7280' }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNER SERVEI ESTACIÓ ── */}
<section className="py-16 bg-white">
  <div className="max-w-7xl mx-auto px-6 lg:px-10">
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #E2E0DA' }}>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="p-10">
          <p className="label mb-3">Partner exclusivo</p>
          <h2 className="h2 text-navy mb-4">
            ¿Tu piso necesita una reforma antes de vender?
          </h2>
          <p className="font-inter text-base leading-relaxed mb-6" style={{ color: '#4B5563' }}>
            Un inmueble reformado se vende más rápido y por encima del precio de mercado. Como colaboradores de <strong>Servei Estació</strong>, el referente en bricolaje y reformas en Cataluña, ofrecemos a nuestros clientes vendedores acceso a presupuestos preferentes y reforma express para poner el inmueble en su mejor versión antes de salir al mercado.
          </p>
          <div className="space-y-2.5 mb-8">
            {[
              'Presupuesto gratuito en 48h',
              'Reforma express: pintura, suelos, baños y cocina',
              'Precios preferentes para clientes qimmo',
              'Coordinación completa: sin que tengas que estar presente',
            ].map(item => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#C49A3C' }} />
                <p className="font-inter text-sm" style={{ color: '#4B5563' }}>{item}</p>
              </div>
            ))}
          </div>
          <a href="/contacto" className="btn-primary inline-flex" style={{ background: '#0D1F3C' }}>
            Solicitar presupuesto de reforma
          </a>
        </div>
        <div className="p-10 flex flex-col justify-center" style={{ background: '#F7F6F2', borderLeft: '1px solid #E2E0DA' }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'white', border: '1px solid #E2E0DA' }}>
              <img src="https://logo.clearbit.com/serveiestacio.com" alt="Servei Estació" width={32} height={32} className="object-contain"
                onError={e => { e.currentTarget.style.display = 'none' }} />
            </div>
            <div>
              <p className="font-jakarta font-bold text-navy">Servei Estació</p>
              <p className="font-inter text-xs" style={{ color: '#9CA3AF' }}>Partner oficial · Bricolaje & Reformas</p>
            </div>
          </div>
          <blockquote className="font-inter text-sm italic leading-relaxed" style={{ color: '#6B7280' }}>
            "Colaboramos con qimmo porque compartimos el mismo enfoque: hacer las cosas bien, con el mejor resultado para el cliente. Un piso reformado multiplica su valor en el mercado."
          </blockquote>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* ── TESTIMONIAL ── */}
      <section className="py-16 bg-white border-y border-[#E2E0DA]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="font-inter text-2xl font-light text-navy leading-snug mb-5 italic">
            "Vendimos en 38 días por encima del precio que esperábamos. El proceso fue completamente transparente, sin ninguna sorpresa."
          </p>
          <p className="font-inter text-sm" style={{ color: '#9CA3AF' }}>— Ana M. y Carlos F., propietarios en Eixample · Barcelona</p>
        </div>
      </section>

      {/* ── FORMULARIO ── */}
      <section id="valoracion" className="py-24" style={{ background: '#F7F6F2' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="lg:sticky lg:top-28">
              <p className="label mb-4">Valoración gratuita</p>
              <h2 className="h2 text-navy mb-5">¿Cuánto vale<br />tu inmueble?</h2>
              <p className="font-inter text-base leading-relaxed mb-8" style={{ color: '#6B7280' }}>
                Déjame tus datos y en menos de 24 horas te contacto con una valoración real. Sin compromiso, sin letra pequeña.
              </p>
              <div className="space-y-4">
                {[
                  'Valoración basada en operaciones cerradas reales',
                  'Sin compromiso ni exclusividad hasta que decidas',
                  'Respuesta en menos de 24 horas',
                ].map(t => (
                  <div key={t} className="flex items-center gap-3">
                    <CheckCircle size={16} style={{ color: '#C49A3C' }} className="shrink-0" />
                    <p className="font-inter text-sm" style={{ color: '#6B7280' }}>{t}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-[#E2E0DA] p-8 shadow-sm">
              <ValoracionForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
