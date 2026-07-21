import { ArrowRight, Phone, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function VenderVivienda() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="h-[64px]" />

      {/* HERO */}
      <section className="hero-gradient pt-20 pb-28 relative overflow-hidden">
        <div className="dot-grid absolute inset-0 pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80')" }} />

        <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-10">
          <Link to="/vender" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 font-inter text-xs transition-colors mb-8">
            <ArrowLeft size={12} /> Vender
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <div className="animate-fade-up">
              <p className="label text-white/35 mb-5">Vende tu vivienda</p>
              <h1 className="font-cormorant font-semibold text-white leading-tight mb-6"
                style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', lineHeight: 1.08 }}>
                Tu piso merece<br />
                <span className="text-gold-shimmer italic">el precio que vale.</span>
              </h1>
              <p className="text-white/55 font-inter text-[15px] leading-relaxed mb-10 max-w-md">
                Vendemos pisos, áticos, dúplex y casas. Valoración honesta, compradores activos
                y acompañamiento completo hasta la firma en notaría.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a href="#valoracion" className="btn-primary-gold">
                  Valoración gratuita <ArrowRight size={14} />
                </a>
                <a href="tel:+34609019160"
                  className="inline-flex items-center gap-2 text-white/50 hover:text-white font-inter text-sm transition-colors duration-200">
                  <Phone size={13} /> 609 019 160
                </a>
              </div>
            </div>

            <div className="space-y-3 animate-fade-up delay-200">
              {[
                { n: '01', t: 'Valoramos con datos reales, no con promesas para captarte.' },
                { n: '02', t: 'Compradores con financiación verificada antes de publicar en portales.' },
                { n: '03', t: 'Fotografía profesional, home staging y difusión premium incluidos.' },
                { n: '04', t: 'Solo cobramos el 3 % al escriturar. Cero gastos previos.' },
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
              { val: '150+',    label: 'Viviendas vendidas',      sub: 'en el área de Barcelona' },
              { val: '98%',     label: 'Del precio solicitado',   sub: 'precio medio conseguido' },
              { val: '45 días', label: 'De media',                sub: 'desde encargo hasta firma' },
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
            <h2 className="h2 leading-tight">Todo lo que<br /><span className="text-gold italic">necesitas</span></h2>
            <p className="text-slate-500 font-inter text-sm leading-relaxed mt-4">
              Un servicio completo de principio a fin, sin necesidad de contratar nada externo.
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              { title: 'Valoración profesional',       body: 'Análisis comparativo de operaciones cerradas en tu zona. Te decimos el precio real de mercado, no uno inflado para que nos elijas.' },
              { title: 'Reportaje fotográfico premium', body: 'Fotografía profesional con edición, plano del inmueble y, si aplica, home staging virtual o físico. Tu vivienda en su mejor versión.' },
              { title: 'Difusión activa y off-market',  body: 'Publicamos en los principales portales y presentamos tu vivienda a nuestra base de compradores con financiación verificada antes de publicar.' },
              { title: 'Negociación y cierre',          body: 'Gestionamos las ofertas, negociamos en tu nombre y coordinamos arras, hipoteca del comprador y escritura en notaría. Sin sorpresas.' },
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

      {/* CONTACTO DIRECTO */}
      <section id="valoracion" className="hero-gradient py-24 relative overflow-hidden">
        <div className="dot-grid absolute inset-0 pointer-events-none" />
        <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl">
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
