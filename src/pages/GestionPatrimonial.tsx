import { Link } from 'react-router-dom'
import {
  ArrowRight, BarChart2, Shield, FileSearch, TrendingUp,
  RefreshCw, PieChart, CheckCircle, Users, Clock
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const SERVICIOS = [
  {
    icon: FileSearch,
    title: 'Diagnóstico patrimonial',
    desc: 'Análisis exhaustivo de todos los activos inmobiliarios: situación jurídica, cargas, ocupación, rentabilidad actual y potencial de mejora.',
  },
  {
    icon: PieChart,
    title: 'Estrategia de cartera',
    desc: 'Diseño del mix óptimo de activos en función del perfil de riesgo, horizonte temporal y objetivos de rentabilidad del cliente.',
  },
  {
    icon: TrendingUp,
    title: 'Adquisición de activos',
    desc: 'Identificación de oportunidades alineadas con la estrategia patrimonial. Acceso a operaciones off-market y análisis previo a la compra.',
  },
  {
    icon: RefreshCw,
    title: 'Rotación y desinversión',
    desc: 'Análisis del momento óptimo para vender o rotar activos dentro de la cartera. Gestión fiscal y coordinación con la operación de sustitución.',
  },
  {
    icon: BarChart2,
    title: 'Seguimiento de rentabilidad',
    desc: 'Reporting periódico de cada activo y del conjunto de la cartera: rendimiento por alquiler, revalorización, gastos y ROI total.',
  },
  {
    icon: Shield,
    title: 'Coordinación con asesores',
    desc: 'Trabajo conjunto con abogados, asesores fiscales y arquitectos para garantizar que cada decisión patrimonial está optimizada en todos los planos.',
  },
]

const PERFIL = [
  { label: 'Patrimonio mínimo orientativo', value: '500.000 €+' },
  { label: 'Número de activos gestionados', value: '2 o más inmuebles' },
  { label: 'Tipología', value: 'Residencial · Comercial · Mixto' },
  { label: 'Ámbito geográfico', value: 'Barcelona y área metropolitana' },
]

const PROCESO = [
  {
    num: '01',
    title: 'Primera reunión',
    desc: 'Sesión de escucha activa para entender la situación patrimonial actual, los objetivos y el horizonte temporal. Sin coste.',
  },
  {
    num: '02',
    title: 'Diagnóstico inicial',
    desc: 'Análisis de los activos existentes: rentabilidades reales, cargas, estado jurídico y potencial de optimización.',
  },
  {
    num: '03',
    title: 'Propuesta estratégica',
    desc: 'Plan de acción detallado con recomendaciones concretas: qué mantener, qué mejorar, qué rotar y qué adquirir.',
  },
  {
    num: '04',
    title: 'Ejecución y seguimiento',
    desc: 'Implementación del plan con gestión directa de cada operación y reporting periódico del estado de la cartera.',
  },
]

export default function GestionPatrimonial() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-40 pb-24 overflow-hidden bg-navy">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1920&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy to-navy-light opacity-95" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
          <p className="label text-white/40 mb-4">Gestión Patrimonial</p>
          <div className="w-10 h-[2px] bg-gold mb-8" />
          <h1 className="h1 text-white max-w-2xl mb-6">
            Tu patrimonio,<br />
            <span className="text-gold italic">con criterio y visión.</span>
          </h1>
          <p className="text-white/55 font-inter text-lg font-light leading-relaxed max-w-xl mb-10">
            Acompaño a familias e inversores privados en la estructuración, optimización y crecimiento de sus carteras inmobiliarias. Con independencia total y enfoque en el resultado a largo plazo.
          </p>
          <Link to="/contacto" className="btn-primary bg-gold text-navy hover:bg-gold-light">
            Solicitar diagnóstico gratuito <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── SERVICIOS ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
        <div className="text-center mb-14">
          <p className="label mb-4">Qué incluye</p>
          <div className="navy-accent mx-auto mb-6" />
          <h2 className="h2 max-w-lg mx-auto">Un servicio integral de principio a fin</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICIOS.map((s, i) => (
            <div key={i} className="card group hover:shadow-hover flex flex-col gap-4">
              <div className="w-11 h-11 rounded-2xl bg-navy/5 flex items-center justify-center group-hover:bg-navy transition-colors duration-300">
                <s.icon size={18} className="text-navy group-hover:text-white transition-colors duration-300" />
              </div>
              <div>
                <h3 className="font-inter font-semibold text-navy text-sm mb-2">{s.title}</h3>
                <p className="text-stone-500 text-xs font-inter leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PARA QUIÉN ── */}
      <section className="bg-navy py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="label text-white/40 mb-4">Perfil de cliente</p>
              <div className="w-10 h-[2px] bg-gold mb-8" />
              <h2 className="h2 text-white mb-6">
                ¿Es para ti<br />
                <span className="text-gold italic">este servicio?</span>
              </h2>
              <p className="text-white/50 font-inter text-sm leading-relaxed mb-8">
                El servicio de gestión patrimonial está diseñado para propietarios con dos o más activos inmobiliarios que quieren dejar de gestionar de forma reactiva y pasar a tener una estrategia clara.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  'Tienes varios inmuebles y no sabes cuál rinde mejor ni peor',
                  'Quieres crecer patrimonialmente pero no sabes por dónde empezar',
                  'Tienes activos infrautilizados o con baja rentabilidad',
                  'Quieres transmitir el patrimonio a la siguiente generación de forma eficiente',
                  'Buscas un asesor independiente, no alguien que solo quiere venderte algo',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle size={14} className="text-gold mt-0.5 shrink-0" />
                    <p className="text-white/60 text-sm font-inter">{item}</p>
                  </div>
                ))}
              </div>
              <Link to="/contacto" className="btn-outline border-white/30 text-white hover:bg-white hover:text-navy">
                Hablemos <ArrowRight size={15} />
              </Link>
            </div>
            <div className="space-y-3">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                <p className="font-inter font-semibold text-white text-sm mb-4 pb-3 border-b border-white/10">Perfil orientativo</p>
                {PERFIL.map((p, i) => (
                  <div key={i} className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-0">
                    <span className="text-white/40 text-xs font-inter">{p.label}</span>
                    <span className="text-gold text-xs font-inter font-semibold">{p.value}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-2xl p-5 text-center">
                  <Users size={18} className="text-gold mx-auto mb-2" />
                  <p className="font-cormorant font-semibold text-3xl text-white">100%</p>
                  <p className="text-white/40 text-[11px] font-inter uppercase tracking-wider mt-1">Independiente</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-5 text-center">
                  <Clock size={18} className="text-gold mx-auto mb-2" />
                  <p className="font-cormorant font-semibold text-3xl text-white">24h</p>
                  <p className="text-white/40 text-[11px] font-inter uppercase tracking-wider mt-1">Primera respuesta</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESO ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
        <div className="text-center mb-14">
          <p className="label mb-4">Cómo trabajamos</p>
          <div className="navy-accent mx-auto mb-6" />
          <h2 className="h2">El proceso</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PROCESO.map((p, i) => (
            <div key={i} className="card flex flex-col gap-4">
              <p className="font-cormorant font-semibold text-5xl text-navy/10">{p.num}</p>
              <div>
                <h3 className="font-inter font-semibold text-navy text-sm mb-2">{p.title}</h3>
                <p className="text-stone-500 text-xs font-inter leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MODELO DE HONORARIOS ── */}
      <section className="bg-stone-bg border-y border-stone-200 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="label mb-4">Honorarios</p>
          <div className="navy-accent mx-auto mb-8" />
          <h2 className="h2 mb-6">Retainer mensual<br /><span className="text-gold italic">+ variable por resultado</span></h2>
          <p className="text-stone-500 font-inter text-sm leading-relaxed mb-8">
            El servicio de gestión patrimonial funciona con un fee mensual de gestión que cubre el diagnóstico, el seguimiento y el reporting. Las operaciones de compra o venta que se ejecuten dentro del plan tienen sus propios honorarios de éxito, acordados previamente.
          </p>
          <p className="text-stone-500 font-inter text-sm leading-relaxed mb-8">
            La primera reunión y el diagnóstico inicial son <strong className="text-navy">sin coste</strong>.
          </p>
          <Link to="/contacto" className="btn-primary">
            Solicitar reunión inicial <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
