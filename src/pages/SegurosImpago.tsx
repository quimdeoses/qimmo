import { useState } from 'react'
import { ArrowRight, CheckCircle, Phone, ShieldCheck } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { enviarASheets } from '../lib/sheets'

export default function SegurosImpago() {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', renta: '', mensaje: '' })
  const [sent, setSent] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="h-[64px]" />

      {/* HERO */}
      <section className="hero-gradient pt-20 pb-28 relative overflow-hidden">
        <div className="dot-grid absolute inset-0 pointer-events-none" />

        <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <div className="animate-fade-up">
              <p className="label text-white/35 mb-5">Seguro de Impago</p>
              <h1 className="font-cormorant font-semibold text-white leading-tight mb-6"
                style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', lineHeight: 1.08 }}>
                Tu renta,<br />
                <span className="text-gold-shimmer italic">pase lo que pase.</span>
              </h1>
              <p className="text-white/55 font-inter text-[15px] leading-relaxed mb-10 max-w-md">
                El seguro de impago garantiza el cobro de tu renta mensual aunque el inquilino deje de pagar.
                Cubre también los gastos legales y el proceso de desahucio si fuera necesario.
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
                { n: '01', t: 'Cobertura desde el primer mes de impago, sin periodo de carencia.' },
                { n: '02', t: 'Hasta 12 meses de renta garantizada más costes de suministros.' },
                { n: '03', t: 'Gastos legales y de desahucio cubiertos. Sin desembolso adicional.' },
                { n: '04', t: 'El coste del seguro es deducible como gasto en el IRPF.' },
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

      {/* STATS */}
      <section className="border-b border-slate-100 py-16">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-3 divide-x divide-slate-100 max-w-2xl mx-auto">
            {[
              { val: '0%',     label: 'Impagos cubiertos',   sub: 'con seguro activo' },
              { val: '12 m',   label: 'De renta garantizada', sub: 'cobertura máxima' },
              { val: '100%',   label: 'Gastos legales',       sub: 'proceso de desahucio' },
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

      {/* QUÉ INCLUYE */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-10 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="label mb-3">Qué incluye</p>
            <div className="gold-line mb-5" />
            <h2 className="h2 leading-tight">Cobertura<br /><span className="text-gold italic">completa</span></h2>
            <p className="text-slate-500 font-inter text-sm leading-relaxed mt-4">
              Una sola póliza que cubre todos los escenarios de impago, de principio a fin.
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              {
                title: 'Rentas impagadas garantizadas',
                body: 'Cobras tu renta mensual desde el primer mes de impago, sin tener que esperar a ningún proceso judicial. Cobertura de hasta 12 meses consecutivos.',
              },
              {
                title: 'Gastos legales y de reclamación',
                body: 'Honorarios de abogado y procurador, tasas judiciales y costes de todo el procedimiento legal contra el inquilino moroso. Sin límite de gastos.',
              },
              {
                title: 'Proceso de desahucio cubierto',
                body: 'Todos los gastos derivados del desahucio por falta de pago, incluyendo los trámites de entrega de posesión y vaciado del inmueble si fuera necesario.',
              },
              {
                title: 'Daños al inmueble por el inquilino',
                body: 'Cobertura opcional de daños ocasionados por el inquilino al inmueble por encima de la fianza depositada. Protección adicional para tu patrimonio.',
              },
            ].map((item, i) => (
              <div key={i} className="py-8 first:pt-0 last:pb-0 grid grid-cols-[32px_1fr] gap-5 items-start">
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <ShieldCheck size={14} className="text-gold" />
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

      {/* TESTIMONIAL */}
      <section className="bg-slate-50 py-20 border-y border-slate-100">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="gold-line mx-auto mb-8" />
          <blockquote className="font-cormorant font-semibold text-navy italic leading-snug mb-6"
            style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
            "Llevamos tres pisos con qimmo. En ninguno hemos tenido un solo mes de impago
            y dormimos tranquilos sabiendo que si pasa, estamos cubiertos."
          </blockquote>
          <p className="font-inter text-slate-400 text-sm tracking-wide">— Jordi P., propietario con 3 inmuebles en gestión</p>
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
                Pide tu cotización<br /><span className="text-gold italic">en minutos</span>
              </h2>
              {['Cotización inmediata sin esperas', 'Cobertura desde el primer impago', 'Sin franquicia ni carencia', 'Gasto deducible en IRPF'].map((item, i) => (
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
                  <p className="text-white/50 text-sm font-inter">Te enviamos tu cotización en menos de 24 horas.</p>
                </div>
              ) : (
                <form onSubmit={async e => { e.preventDefault(); await enviarASheets('Seguros_Impago', { nombre: form.nombre, email: form.email, telefono: form.telefono, renta: form.renta, mensaje: form.mensaje }); setSent(true) }}
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
                    <div>
                      <label className="label-field">Email *</label>
                      <input required type="email" className="input" placeholder="tu@email.com"
                        value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                    <div>
                      <label className="label-field">Renta mensual</label>
                      <input type="text" className="input" placeholder="1.200€"
                        value={form.renta} onChange={e => setForm(f => ({ ...f, renta: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="label-field">Cuéntanos más sobre tu alquiler</label>
                    <textarea rows={3} className="input resize-none"
                      placeholder="Tiene inquilino activo, tiempo de contrato restante, si ya has tenido impagos..."
                      value={form.mensaje} onChange={e => setForm(f => ({ ...f, mensaje: e.target.value }))} />
                  </div>
                  <button type="submit" className="btn-primary w-full justify-center py-4 text-sm">
                    Solicitar cotización gratuita <ArrowRight size={15} />
                  </button>
                  <p className="text-slate-400 text-[11px] font-inter text-center">
                    Sin compromiso · Respuesta en 24 h · Gasto deducible en IRPF
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
