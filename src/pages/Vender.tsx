import { Phone } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Vender() {
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
                Viviendas, locales, oficinas y naves. Con o sin inquilinos. Gestionamos todo el proceso
                con total transparencia y un único objetivo: el mejor precio en el menor tiempo.
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
                { n: '02', t: 'Compradores activos y difusión premium antes de publicar en portales.' },
                { n: '03', t: 'Negociamos en tu nombre. Solo cobramos cuando tú cobras.' },
                { n: '04', t: 'Te acompañamos hasta notaría. Sin sorpresas, sin letra pequeña.' },
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
                title: 'Valoramos tu piso con datos reales, no con promesas',
                body:  'Analizamos operaciones cerradas en tu zona, la demanda actual y el estado de tu inmueble. Te damos un precio real, no uno inflado para que nos elijas.',
              },
              {
                title: 'Compradores cualificados antes de publicar',
                body:  'Tenemos una base de compradores activos con financiación verificada. En muchos casos cerramos la operación off-market, sin publicar el inmueble en portales.',
              },
              {
                title: 'Solo cobramos cuando tú cobras',
                body:  'Sin gastos previos, sin depósitos, sin cargos si no vendemos. Únicamente cobramos al escriturar.',
              },
              {
                title: 'Comunicación directa, siempre',
                body:  'Tendrás un consultor asignado que te informa semanalmente. Sin centralitas, sin comerciales que te pasen el teléfono. Siempre la misma persona.',
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
              { n: '04', title: 'Negociación y escritura',    time: 'Cierre',      desc: 'Gestionamos las ofertas, negociamos en tu nombre y coordinamos el contrato de arras, el préstamo del comprador y la notaría.' },
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

      {/* ── CONTACTO DIRECTO ──────────────────────────────────────────── */}
      <section id="valoracion" className="py-24 relative overflow-hidden" style={{ background: '#0D1F3C' }}>
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
