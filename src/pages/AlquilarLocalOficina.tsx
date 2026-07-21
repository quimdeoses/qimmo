import { ArrowRight, CheckCircle, Phone, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function AlquilarLocalOficina() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="h-[64px]" />

      {/* HERO */}
      <section className="hero-gradient pt-20 pb-28 relative overflow-hidden">
        <div className="dot-grid absolute inset-0 pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80')" }} />

        <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-10">
          <Link to="/alquilar" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 font-inter text-xs transition-colors mb-8">
            <ArrowLeft size={12} /> Alquilar
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <div className="animate-fade-up">
              <p className="label text-white/35 mb-5">Alquila tu local u oficina</p>
              <h1 className="font-cormorant font-semibold text-white leading-tight mb-6"
                style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', lineHeight: 1.08 }}>
                Inquilinos solventes,<br />
                <span className="text-gold-shimmer italic">contratos seguros.</span>
              </h1>
              <p className="text-white/55 font-inter text-[15px] leading-relaxed mb-10 max-w-md">
                Gestionamos el alquiler de locales comerciales y oficinas. Conectamos con empresas
                y operadores cualificados y te acompañamos en cada renovación.
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
                { n: '01', t: 'Empresas verificadas: balance, solvencia y referencias de locales anteriores.' },
                { n: '02', t: 'Contratos de arrendamiento de uso distinto de vivienda. Duración mínima 5 años.' },
                { n: '03', t: 'Negociamos la fianza, garantías adicionales y las obras de adecuación.' },
                { n: '04', t: 'Gestión de incidencias, renovaciones y actualización de rentas.' },
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

      {/* PARA QUÉ ACTIVOS */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-10 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="label mb-3">Qué gestionamos</p>
            <div className="gold-line mb-5" />
            <h2 className="h2 leading-tight">Todo tipo de<br /><span className="text-gold italic">espacio comercial</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Local a pie de calle',       desc: 'Restauración, retail, servicios. Con o sin licencia de actividad previa.' },
              { title: 'Oficina o suite',             desc: 'Planta completa, despacho o edificio. Con o sin muebles.' },
              { title: 'Local en galería o centro',   desc: 'Espacios en complejos comerciales o mercados. Gestión con la comunidad.' },
              { title: 'Nave o almacén',              desc: 'Logística, taller, producción. Certificados de carga y accesos incluidos.' },
              { title: 'Con actividad existente',     desc: 'Arrendamos el local con el negocio en marcha cuando aplica.' },
              { title: 'Vacío o para reformar',       desc: 'Captamos al inquilino adecuado y negociamos la obra a cargo del arrendatario.' },
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
