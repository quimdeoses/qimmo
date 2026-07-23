import { useState } from 'react'
import { ArrowRight, CheckCircle, Phone, Shield } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { enviarASheets } from '../lib/sheets'

const COBERTURAS = [
  {
    icon: '🏠',
    title: 'Daños estructurales',
    desc: 'Incendio, explosión, derrumbe, inundación y daños por agua. Cobertura del continente y el contenido.',
  },
  {
    icon: '🔒',
    title: 'Responsabilidad civil',
    desc: 'Daños a terceros causados desde tu vivienda. Fugas, humedades, caídas en zonas comunes.',
  },
  {
    icon: '🛠️',
    title: 'Asistencia en el hogar',
    desc: 'Cerrajería, fontanería, electricidad y cristalería. Servicio urgente 24/7 sin franquicia.',
  },
  {
    icon: '📦',
    title: 'Contenido y objetos de valor',
    desc: 'Robo, vandalismo y daños accidentales a mobiliario, equipos electrónicos y objetos de valor.',
  },
  {
    icon: '⚡',
    title: 'Daños eléctricos',
    desc: 'Sobretensiones, cortocircuitos y averías en electrodomésticos por defectos eléctricos.',
  },
  {
    icon: '🌡️',
    title: 'Daños climatológicos',
    desc: 'Granizo, viento huracanado, heladas y otros fenómenos atmosféricos reconocidos.',
  },
]

export default function SegurosHogar() {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', mensaje: '' })
  const [sent, setSent] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="h-[80px]" />

      {/* HERO */}
      <section className="hero-gradient pt-20 pb-28 relative overflow-hidden">
        <div className="dot-grid absolute inset-0 pointer-events-none" />

        <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <div className="animate-fade-up">
              <p className="label text-white/35 mb-5">Seguro de Hogar</p>
              <h1 className="font-cormorant font-semibold text-white leading-tight mb-6"
                style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', lineHeight: 1.08 }}>
                Tu hogar protegido,<br />
                <span className="text-gold-shimmer italic">sin sorpresas.</span>
              </h1>
              <p className="text-white/55 font-inter text-[15px] leading-relaxed mb-10 max-w-md">
                Analizamos tu situación y te recomendamos la póliza de hogar más adecuada.
                Coberturas reales, sin exclusiones que te dejen desprotegido en el peor momento.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a href="#contacto" className="btn-primary-gold">
                  Solicitar cotización <ArrowRight size={14} />
                </a>
                <a href="tel:+34609019160"
                  className="inline-flex items-center gap-2 text-white/50 hover:text-white font-inter text-sm transition-colors duration-200">
                  <Phone size={13} /> 609 019 160
                </a>
              </div>
            </div>

            <div className="space-y-3 animate-fade-up delay-200">
              {[
                { n: '01', t: 'Comparamos más de 15 aseguradoras para encontrarte el mejor precio-cobertura.' },
                { n: '02', t: 'Te explicamos qué cubre y qué excluye cada póliza, sin letra pequeña.' },
                { n: '03', t: 'Asistencia en la gestión de siniestros. Estamos contigo cuando más lo necesitas.' },
                { n: '04', t: 'Revisión anual de tu póliza para adaptarla a los cambios de tu vivienda.' },
              ].map((item, i) => (
                <div key={i} className="glass-card flex items-start gap-4 px-5 py-4">
                  <span className="font-inter font-black text-gold text-[11px] tracking-wider shrink-0 mt-0.5">{item.n}</span>
                  <p className="text-white/65 text-sm font-inter leading-relaxed">{item.t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COBERTURAS */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-10 py-24">
        <div className="text-center mb-14">
          <p className="label mb-3">¿Qué cubre?</p>
          <div className="gold-line mx-auto mb-5" />
          <h2 className="h2 leading-tight">Coberturas<br /><span className="text-gold italic">principales</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COBERTURAS.map((c, i) => (
            <div key={i} className="p-6 rounded-2xl border border-slate-100 hover:border-navy/20 hover:shadow-md transition-all duration-300">
              <span className="text-2xl mb-4 block">{c.icon}</span>
              <h3 className="font-inter font-bold text-navy text-sm mb-2">{c.title}</h3>
              <p className="text-slate-500 text-xs font-inter leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PARA QUIÉN */}
      <section className="bg-slate-50 border-y border-slate-100 py-20">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Vivienda habitual', desc: 'La que necesita mayor protección. Coberturas amplias con asistencia 24h y responsabilidad civil incluida.' },
              { icon: Shield, title: 'Segunda residencia', desc: 'Póliza adaptada a pisos que pasan periodos sin ocupación. Con cobertura de robos y daños sin franquicia mínima.' },
              { icon: Shield, title: 'Vivienda en alquiler', desc: 'Para propietarios que alquilan. Protege el continente con coberturas específicas para daños por inquilinos.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-navy/8 flex items-center justify-center mb-4">
                  <item.icon size={18} className="text-navy" />
                </div>
                <h3 className="font-inter font-bold text-navy text-sm mb-2">{item.title}</h3>
                <p className="text-slate-500 text-xs font-inter leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM */}
      <section id="contacto" className="hero-gradient py-24 relative overflow-hidden">
        <div className="dot-grid absolute inset-0 pointer-events-none" />
        <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-16 items-start">
            <div className="lg:sticky lg:top-28">
              <p className="label text-white/35 mb-3">Sin compromiso</p>
              <div className="gold-line mb-5" />
              <h2 className="h2 text-white mb-5">
                Pide tu cotización<br /><span className="text-gold italic">es gratis</span>
              </h2>
              {['Sin coste ni compromiso', 'Comparamos 15+ aseguradoras', 'Te explicamos cada cobertura', 'Gestión de siniestros incluida'].map((item, i) => (
                <div key={i} className="flex items-start gap-3 mb-3">
                  <CheckCircle size={13} className="text-gold shrink-0 mt-0.5" />
                  <p className="text-white/55 text-sm font-inter">{item}</p>
                </div>
              ))}
            </div>

            <div>
              {sent ? (
                <div className="glass-card text-center py-20">
                  <CheckCircle size={44} className="text-green-400 mx-auto mb-5" />
                  <p className="font-inter font-bold text-white text-xl mb-2">¡Solicitud recibida!</p>
                  <p className="text-white/50 text-sm font-inter">Te contactamos en menos de 24 horas con tu cotización.</p>
                </div>
              ) : (
                <form onSubmit={async e => { e.preventDefault(); await enviarASheets('Seguros_Hogar', { nombre: form.nombre, email: form.email, telefono: form.telefono, mensaje: form.mensaje }); setSent(true) }}
                  className="bg-white rounded-2xl p-8 space-y-5 shadow-2xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label-field">Nombre *</label>
                      <input required type="text" className="input" placeholder="Tu nombre completo"
                        value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
                    </div>
                    <div>
                      <label className="label-field">Teléfono *</label>
                      <input required type="tel" className="input" placeholder="+34 6XX XXX XXX"
                        value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="label-field">Email *</label>
                      <input required type="email" className="input" placeholder="tu@email.com"
                        value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="label-field">Cuéntanos sobre tu vivienda</label>
                    <textarea rows={4} className="input resize-none"
                      placeholder="Tipo (piso, casa, chalet), m², si es habitual o segunda residencia, si está alquilada, póliza actual si tienes..."
                      value={form.mensaje} onChange={e => setForm(f => ({ ...f, mensaje: e.target.value }))} />
                  </div>
                  <button type="submit" className="btn-primary w-full justify-center py-4 text-sm">
                    Solicitar cotización gratuita <ArrowRight size={15} />
                  </button>
                  <p className="text-slate-400 text-[11px] font-inter text-center">
                    Sin compromiso · Respuesta en 24 h · Comparamos 15+ aseguradoras
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
