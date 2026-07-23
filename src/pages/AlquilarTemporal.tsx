import { ArrowRight, CheckCircle, Phone, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function AlquilarTemporal() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="h-[80px]" />

      {/* HERO */}
      <section className="hero-gradient pt-20 pb-28 relative overflow-hidden">
        <div className="dot-grid absolute inset-0 pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1920&q=80')" }} />

        <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-10">
          <Link to="/alquilar" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 font-inter text-xs transition-colors mb-8">
            <ArrowLeft size={12} /> Alquilar
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <div className="animate-fade-up">
              <p className="label text-white/35 mb-5">Alquiler temporal</p>
              <h1 className="font-cormorant font-semibold text-white leading-tight mb-6"
                style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', lineHeight: 1.08 }}>
                Mayor rentabilidad,<br />
                <span className="text-gold-shimmer italic">menos compromisos.</span>
              </h1>
              <p className="text-white/55 font-inter text-[15px] leading-relaxed mb-10 max-w-md">
                Estancias de 1 a 11 meses para estudiantes, profesionales en movilidad y expatriados.
                Más renta que el alquiler tradicional, con total cobertura legal.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a href="#contacto" className="btn-primary-gold">
                  Hablar con un consultor <ArrowRight size={14} />
                </a>
                <a href="tel:+34609019160"
                  className="inline-flex items-center gap-2 text-white/50 hover:text-white font-inter text-sm transition-colors duration-200">
                  <Phone size={13} /> 609 019 160
                </a>
              </div>
            </div>

            <div className="space-y-3 animate-fade-up delay-200">
              {[
                { n: '01', t: 'Rentas un 20–35% superiores al alquiler residencial estándar.' },
                { n: '02', t: 'Inquilinos de alto perfil: estudiantes de máster, profesionales en proyectos, directivos.' },
                { n: '03', t: 'Contratos de temporada amparados por la LAU. Sin prórroga forzosa.' },
                { n: '04', t: 'Gestión completa: rotación, check-in/out, limpieza y reposición.' },
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

      {/* COMPARATIVA */}
      <section className="border-b border-slate-100 py-16">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="max-w-3xl mx-auto">
            <p className="label text-center mb-3">¿Por qué temporal?</p>
            <div className="gold-line mx-auto mb-10" />
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Alquiler tradicional', items: ['Renta de mercado estándar', 'Prórroga forzosa del inquilino', 'Contrato mínimo 5–7 años', 'Actualización anual del IPC'], dark: false },
                { label: 'Alquiler temporal',     items: ['Renta 20–35% superior', 'Sin prórroga forzosa', 'Duración de 1 a 11 meses', 'Ajuste de precio en cada rotación'], dark: true },
              ].map((col, i) => (
                <div key={i} className={`rounded-2xl p-6 ${col.dark ? 'text-white' : 'border border-slate-200 bg-white'}`}
                  style={col.dark ? { background: 'linear-gradient(135deg, #1A2744 0%, #1A3060 100%)' } : {}}>
                  <p className={`font-inter font-semibold text-xs uppercase tracking-wider mb-4 ${col.dark ? 'text-white/40' : 'text-slate-400'}`}>{col.label}</p>
                  {col.items.map((item, j) => (
                    <div key={j} className={`flex items-start gap-2.5 mb-2.5 last:mb-0`}>
                      <CheckCircle size={13} className={`shrink-0 mt-0.5 ${col.dark ? 'text-gold' : 'text-slate-300'}`} />
                      <p className={`text-xs font-inter leading-relaxed ${col.dark ? 'text-white/70' : 'text-slate-500'}`}>{item}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* A QUIÉN VA */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-10 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="label mb-3">Inquilinos que captamos</p>
            <div className="gold-line mb-5" />
            <h2 className="h2 leading-tight">Perfiles<br /><span className="text-gold italic">de confianza</span></h2>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              { title: 'Estudiantes de máster y posgrado',    body: 'Matriculados en universidades y escuelas de negocio de Barcelona (IESE, ESADE, UPF). Estancias de 9–11 meses con pagadores solventes.' },
              { title: 'Profesionales en proyectos',          body: 'Consultores, ingenieros y ejecutivos en Barcelona por proyectos de 1–6 meses. Con empresa pagadora o garantía corporativa.' },
              { title: 'Directivos expatriados',              body: 'Traslados internacionales, executives en periodo de búsqueda de vivienda definitiva. Rentas altas y bajo desgaste del inmueble.' },
              { title: 'Médicos y residentes MIR',            body: 'Profesionales sanitarios durante su residencia o rotación. Perfil estable y comprometido.' },
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
      <section id="contacto" className="hero-gradient py-24 relative overflow-hidden">
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
