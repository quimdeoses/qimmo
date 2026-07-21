import { Link } from 'react-router-dom'
import { ArrowRight, Building2, Landmark, BarChart3, Search, FileCheck, Handshake, TrendingUp, Scale } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const AREAS = [
  {
    icon: Building2,
    title: 'Intermediación Inmobiliaria',
    subtitle: 'Compraventa & Alquiler',
    desc: 'Gestión integral de operaciones residenciales y comerciales. Identifico oportunidades, presento el activo al mercado adecuado y negocio en tu nombre para maximizar el resultado.',
    bullets: [
      'Valoración precisa del activo',
      'Marketing profesional y difusión selectiva',
      'Selección y cualificación de interesados',
      'Negociación y acompañamiento notarial',
      'Acceso a operaciones off-market',
    ],
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
  },
  {
    icon: Landmark,
    title: 'Gestión Patrimonial',
    subtitle: 'Carteras & Estructuración',
    desc: 'Diseño y optimización de carteras inmobiliarias para particulares y family offices. Con visión a largo plazo, analizo cada activo dentro del conjunto patrimonial para maximizar la rentabilidad y minimizar el riesgo.',
    bullets: [
      'Diagnóstico y auditoría de cartera',
      'Estrategia de adquisición o desinversión',
      'Optimización fiscal en coordinación con asesores',
      'Seguimiento de rentabilidad periódico',
      'Gestión de activos en arrendamiento',
    ],
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
  },
  {
    icon: BarChart3,
    title: 'Inversión & Due Diligence',
    subtitle: 'Análisis & Decisión',
    desc: 'Para inversores que quieren tomar decisiones con datos. Realizo análisis de rentabilidad, estudio de mercado y due diligence técnica-jurídica para reducir el riesgo en cada operación.',
    bullets: [
      'Análisis de rentabilidad bruta, neta y cashflow',
      'Due diligence técnica y urbanística',
      'Revisión documental y jurídica',
      'Comparativa de activos y benchmarking de mercado',
      'Informe ejecutivo de inversión',
    ],
    img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
  },
]

const PROCESO = [
  { icon: Search,     title: 'Análisis inicial',   desc: 'Escucha activa de tu situación, objetivos y horizonte temporal. Sin plantillas, sin prisa.' },
  { icon: FileCheck,  title: 'Propuesta a medida',  desc: 'Plan de acción específico con alcance, honorarios y métricas de éxito claramente definidas.' },
  { icon: Handshake,  title: 'Ejecución y seguimiento', desc: 'Gestión directa con reportes periódicos. Siempre accesible, siempre actualizado.' },
  { icon: TrendingUp, title: 'Cierre y resultado',  desc: 'Acompañamiento hasta el final de la operación con análisis post-cierre si es necesario.' },
]

export default function Servicios() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-40 pb-20 overflow-hidden bg-navy">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-dark to-navy opacity-98" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
          <p className="label text-white/40 mb-4">Servicios</p>
          <div className="w-10 h-[2px] bg-gold mb-8" />
          <h1 className="h1 text-white max-w-2xl mb-6">
            Asesoramiento en cada<br />
            <span className="text-gold italic">fase de la operación</span>
          </h1>
          <p className="text-white/50 font-inter text-lg font-light leading-relaxed max-w-xl">
            Desde la primera conversación hasta la firma. Un consultor independiente con visión estratégica y experiencia en todos los segmentos del mercado.
          </p>
        </div>
      </section>

      {/* ── ÁREAS ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 space-y-20">
        {AREAS.map((area, i) => (
          <div key={i} className={`grid grid-cols-1 lg:grid-cols-2 gap-14 items-center ${i % 2 === 1 ? 'lg:flex lg:flex-row-reverse' : ''}`}>
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-navy flex items-center justify-center">
                  <area.icon size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-inter font-semibold text-navy text-base">{area.title}</p>
                  <p className="text-stone-300 text-xs font-inter uppercase tracking-wider">{area.subtitle}</p>
                </div>
              </div>
              <div className="navy-accent mb-6" />
              <p className="text-stone-500 font-inter text-sm leading-relaxed mb-7">{area.desc}</p>
              <ul className="space-y-2.5">
                {area.bullets.map((b, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm font-inter text-stone-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link to="/contacto" className="btn-primary">
                  Solicitar información <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src={area.img}
                alt={area.title}
                className="w-full aspect-[4/3] object-cover rounded-2xl shadow-hover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/20 to-transparent rounded-2xl" />
            </div>
          </div>
        ))}
      </section>

      {/* ── PROCESO ── */}
      <section className="bg-navy py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <p className="label text-white/40 mb-4">Cómo trabajo</p>
            <div className="w-10 h-[2px] bg-gold mx-auto mb-6" />
            <h2 className="h2 text-white">El proceso</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden">
            {PROCESO.map((p, i) => (
              <div key={i} className="bg-white/5 p-7 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                  <p.icon size={16} className="text-gold" />
                </div>
                <p className="font-cormorant font-semibold text-3xl text-gold/20 mb-2">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="font-inter font-semibold text-white text-sm mb-2">{p.title}</h3>
                <p className="text-white/40 text-xs font-inter leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HONORARIOS ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="label mb-4">Honorarios</p>
            <div className="navy-accent mb-8" />
            <h2 className="h2 mb-6">Alineado con<br /><span className="text-gold italic">tu resultado</span></h2>
            <p className="text-stone-500 font-inter text-sm leading-relaxed mb-6">
              Mi modelo de honorarios está diseñado para que mis intereses vayan siempre en la misma dirección que los tuyos. En intermediación, trabajo a éxito. En consultoría patrimonial e inversión, con retainer mensual o proyecto cerrado.
            </p>
            <p className="text-stone-500 font-inter text-sm leading-relaxed">
              Cada encargo es diferente. Conversemos y te propongo la estructura más adecuada.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              { tipo: 'Intermediación', modelo: 'Solo éxito', desc: 'Honorarios vinculados al cierre de la operación. Sin cierre, sin coste.' },
              { tipo: 'Gestión patrimonial', modelo: 'Retainer + variable', desc: 'Fee mensual de gestión con componente variable ligado a resultados.' },
              { tipo: 'Consultoría de inversión', modelo: 'Proyecto cerrado', desc: 'Presupuesto fijo por proyecto — due diligence, análisis, informes.' },
            ].map((h, i) => (
              <div key={i} className="card flex items-start gap-5">
                <Scale size={16} className="text-gold mt-1 shrink-0" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-inter font-semibold text-navy text-sm">{h.tipo}</p>
                    <span className="text-[10px] font-inter font-semibold uppercase tracking-wider text-gold bg-gold/10 px-2 py-0.5 rounded-md">{h.modelo}</span>
                  </div>
                  <p className="text-stone-500 text-xs font-inter leading-relaxed">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-stone-bg border-y border-stone-200 py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="h2 mb-4">¿Encaja con lo que necesitas?</h2>
          <p className="text-stone-500 font-inter text-sm leading-relaxed mb-8">Cuéntame tu caso y en 24h te respondo con una propuesta o una llamada.</p>
          <Link to="/contacto" className="btn-primary">
            Hablar con Quim <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
