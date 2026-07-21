import { ArrowRight, CheckCircle, Phone, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function VenderLocal() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="h-[64px]" />

      {/* HERO */}
      <section className="hero-gradient pt-20 pb-28 relative overflow-hidden">
        <div className="dot-grid absolute inset-0 pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=80')" }} />

        <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-10">
          <Link to="/vender" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 font-inter text-xs transition-colors mb-8">
            <ArrowLeft size={12} /> Vender
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <div className="animate-fade-up">
              <p className="label text-white/35 mb-5">Vende tu local o nave</p>
              <h1 className="font-cormorant font-semibold text-white leading-tight mb-6"
                style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', lineHeight: 1.08 }}>
                Tu activo comercial,<br />
                <span className="text-gold-shimmer italic">al comprador adecuado.</span>
              </h1>
              <p className="text-white/55 font-inter text-[15px] leading-relaxed mb-10 max-w-md">
                Vendemos locales comerciales, oficinas y naves industriales. Conectamos con inversores,
                empresas y operadores que buscan activos como el tuyo.
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
                { n: '01', t: 'Valoración comercial con análisis de rentabilidad y comparables cerrados.' },
                { n: '02', t: 'Red de inversores, family offices y operadores buscando activos productivos.' },
                { n: '03', t: 'Gestión de due diligence, cargas y documentación técnica incluida.' },
                { n: '04', t: 'Honorarios solo al escriturar. Sin exclusividad obligatoria.' },
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
              { val: '50+',     label: 'Locales y naves vendidos', sub: 'en el área de Barcelona' },
              { val: '200M€',   label: 'En activos asesorados',    sub: 'volumen total gestionado' },
              { val: '60 días', label: 'De media',                 sub: 'desde encargo hasta firma' },
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

      {/* PARA QUIÉN */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-10 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="label mb-3">Vendemos si tienes</p>
            <div className="gold-line mb-5" />
            <h2 className="h2 leading-tight">Cualquier tipo de<br /><span className="text-gold italic">activo comercial</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Local comercial',     desc: 'Bajo, esquina, a pie de calle. Con o sin inquilino activo.' },
              { title: 'Oficina',             desc: 'Planta entera, suite o edificio completo.' },
              { title: 'Nave industrial',     desc: 'Logística, fabricación, almacenaje. Cualquier superficie.' },
              { title: 'Edificio de rentas',  desc: 'Mixto residencial-comercial. Con plan de negocio incluido.' },
              { title: 'Con inquilino',       desc: 'Vendemos como inversión con rentabilidad calculada.' },
              { title: 'Vacío o en reforma',  desc: 'Captamos al comprador adecuado según el estado del activo.' },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-2xl border border-slate-100 hover:border-navy/20 hover:shadow-md transition-all duration-300">
                <CheckCircle size={16} className="text-gold mb-3" />
                <p className="font-inter font-bold text-navy text-sm mb-1">{item.title}</p>
                <p className="text-slate-500 text-xs font-inter leading-relaxed">{item.desc}</p>
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
