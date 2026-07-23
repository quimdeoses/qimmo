import { ArrowRight, CheckCircle, Phone, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function AlquilarPiso() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="h-[80px]" />

      {/* HERO */}
      <section className="hero-gradient pt-20 pb-28 relative overflow-hidden">
        <div className="dot-grid absolute inset-0 pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1920&q=80')" }} />

        <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-10">
          <Link to="/alquilar" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 font-inter text-xs transition-colors mb-8">
            <ArrowLeft size={12} /> Alquilar
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <div className="animate-fade-up">
              <p className="label text-white/35 mb-5">Alquila tu piso</p>
              <h1 className="font-cormorant font-semibold text-white leading-tight mb-6"
                style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', lineHeight: 1.08 }}>
                Tu renta, puntual.<br />
                <span className="text-gold-shimmer italic">Sin preocupaciones.</span>
              </h1>
              <p className="text-white/55 font-inter text-[15px] leading-relaxed mb-10 max-w-md">
                Gestionamos el alquiler de tu piso de principio a fin: encontramos al inquilino ideal,
                redactamos el contrato y cobramos la renta cada mes en tu nombre.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a href="#gestion" className="btn-primary-gold">
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
                { n: '01', t: 'Inquilinos verificados: CIRBE, nóminas, referencias y entrevista personal.' },
                { n: '02', t: 'Contrato redactado por nuestro equipo legal. Cláusulas que te protegen.' },
                { n: '03', t: 'Cobro mensual, incidencias gestionadas y comunicación directa con el inquilino.' },
                { n: '04', t: 'Seguro de impago opcional: hasta 12 meses de renta garantizada.' },
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

      {/* MODALIDADES */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-10 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="label mb-3">Elige tu modalidad</p>
            <div className="gold-line mb-5" />
            <h2 className="h2 leading-tight">Gestión a<br /><span className="text-gold italic">tu medida</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                title: 'Solo publicación', price: '1 mes de renta', sub: 'pago único al firmar',
                features: ['Valoración de precio de mercado', 'Fotografía profesional', 'Publicación en portales premium', 'Verificación del inquilino', 'Redacción del contrato', 'Inventario del inmueble'],
                highlight: false,
              },
              {
                title: 'Gestión completa', price: '8% mensual', sub: 'sobre la renta, sin costes fijos',
                features: ['Todo lo anterior incluido', 'Cobro y liquidación mensual', 'Gestión de incidencias', 'Comunicación con el inquilino', 'Renovaciones y actualización', 'Seguro de impago incluido'],
                highlight: true,
              },
            ].map((m, i) => (
              <div key={i} className={`rounded-2xl p-7 flex flex-col gap-5 ${
                m.highlight ? 'text-white' : 'bg-white border border-slate-200'
              }`} style={m.highlight ? { background: 'linear-gradient(135deg, #1A2744 0%, #1A3060 100%)' } : {}}>
                {m.highlight && (
                  <span className="self-start bg-gold/20 text-gold text-[10px] font-inter font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
                    Más elegido
                  </span>
                )}
                <div>
                  <p className={`font-inter font-semibold text-xs uppercase tracking-wider mb-2 ${m.highlight ? 'text-white/40' : 'text-slate-400'}`}>{m.title}</p>
                  <p className={`font-inter font-black tabular-nums mb-1 ${m.highlight ? 'text-gold' : 'text-navy'}`} style={{ fontSize: '1.8rem' }}>{m.price}</p>
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
                <a href="#gestion" className={`w-full text-center py-3 rounded-xl font-inter font-semibold text-sm transition-all duration-200 ${
                  m.highlight ? 'bg-gold text-navy hover:bg-gold-light' : 'border-2 border-navy text-navy hover:bg-navy hover:text-white'
                }`}>
                  Empezar
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO DIRECTO */}
      <section id="gestion" className="hero-gradient py-24 relative overflow-hidden">
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
