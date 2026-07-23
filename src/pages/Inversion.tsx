import { useState } from 'react'

import {
  ArrowRight, CheckCircle,
  Home, Building2, Warehouse, TrendingUp,
  Search, BarChart3, FileCheck, Target,
  PieChart, RefreshCw, Shield, Phone
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const RENDIMIENTOS = [
  { tipo: 'Residencial · Barcelona prime',     renta: '3–4,5%', total: '6–9%'   },
  { tipo: 'Residencial · Área metropolitana',  renta: '4–6%',   total: '7–11%'  },
  { tipo: 'Local comercial bien ubicado',       renta: '4–6%',   total: '6–9%'   },
  { tipo: 'Compra · reforma · venta (flip)',    renta: '—',      total: '15–25%' },
]

const TIPOLOGIAS = [
  { icon: Home,      title: 'Residencial',              desc: 'Pisos y áticos en zonas prime o de alta demanda. Rentas estables y revalorización sólida a medio plazo.' },
  { icon: Building2, title: 'Comercial y oficinas',     desc: 'Locales y edificios terciarios con contratos de larga duración y yields más altos que el residencial.' },
  { icon: Warehouse, title: 'Valor añadido',            desc: 'Activos con margen de mejora: reformas, cambios de uso o rehabilitaciones para maximizar el retorno.' },
  { icon: TrendingUp,title: 'Carteras y edificios',     desc: 'Conjuntos de activos o edificios completos para inversores con mayor capacidad y horizonte más largo.' },
]

const DUE_DILIGENCE = [
  'Análisis de rentabilidad bruta, neta y cashflow',
  'Estudio de mercado comparativo de la zona',
  'Revisión de cargas, hipotecas y situación registral',
  'Informe técnico básico del estado del inmueble',
  'Valoración independiente del activo',
  'Modelización financiera por escenarios',
  'Coordinación con financiación bancaria',
  'Informe ejecutivo en formato PDF',
]

export default function Inversion() {
  const [perfil, setPerfil] = useState<'inversor' | 'patrimonio' | null>(null)

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="h-[80px]" />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="bg-navy pt-20 pb-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.06]"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80')" }} />
        <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="label text-white/35 mb-5">Inversión y patrimonio</p>
              <h1 className="font-cormorant font-semibold text-white leading-tight mb-6"
                style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', lineHeight: 1.1 }}>
                Inversión inmobiliaria<br />
                <span className="text-gold italic">con criterio y datos.</span>
              </h1>
              <p className="text-white/55 font-inter text-[15px] leading-relaxed mb-10 max-w-md">
                Tanto si quieres comprar tu primera inversión como si tienes varias propiedades y quieres optimizarlas,
                te acompañamos con análisis independiente y visión a largo plazo.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a href="#contacto-inversion" className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-inter font-semibold text-sm transition-all" style={{ background: '#C49A3C', color: '#0D1F3C' }}>
                  Hablar de mi caso <ArrowRight size={14} />
                </a>
                <a href="tel:+34609019160"
                  className="inline-flex items-center gap-2 text-white/50 hover:text-white font-inter text-sm transition-colors duration-200">
                  <Phone size={13} /> 609 019 160
                </a>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { n: '01', t: 'Análisis independiente de cada operación: rentabilidad, riesgos y due diligence completa.' },
                { n: '02', t: 'Acceso a operaciones off-market antes de que salgan al mercado público.' },
                { n: '03', t: 'Gestión activa de carteras patrimoniales: qué mantener, qué rotar y qué adquirir.' },
                { n: '04', t: 'Solo cobramos cuando la operación se cierra. Sin costes ni compromisos previos.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 bg-white/[0.04] border border-white/[0.07] rounded-xl px-5 py-4">
                  <span className="font-inter font-black text-gold text-[11px] tracking-wider shrink-0 mt-0.5">{item.n}</span>
                  <p className="text-white/65 text-sm font-inter leading-relaxed">{item.t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DOS PERFILES ──────────────────────────────────────────────── */}
      <section className="border-b border-slate-100 py-16">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <p className="text-center font-inter text-slate-400 text-sm mb-8">¿Con qué perfil te identificas?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {([
              {
                key: 'inversor' as const,
                title: 'Quiero invertir',
                desc: 'Busco mi primera o siguiente propiedad de inversión. Necesito ayuda para encontrar el activo adecuado, analizar la operación y cerrarla bien.',
                tags: ['Residencial', 'Comercial', 'Flips', 'Off-market'],
              },
              {
                key: 'patrimonio' as const,
                title: 'Ya tengo activos',
                desc: 'Tengo dos o más inmuebles y quiero saber qué rinde bien, qué optimizar y cómo hacer crecer el patrimonio de forma estructurada.',
                tags: ['Diagnóstico', 'Rotación', 'Reporting', 'Estrategia'],
              },
            ]).map(p => (
              <button key={p.key} type="button"
                onClick={() => setPerfil(prev => prev === p.key ? null : p.key)}
                className={`rounded-2xl p-6 text-left border-2 transition-all duration-200 ${
                  perfil === p.key
                    ? 'border-navy bg-navy text-white'
                    : 'border-slate-200 bg-white hover:border-navy/30'
                }`}>
                <p className={`font-inter font-bold text-sm mb-2 ${perfil === p.key ? 'text-white' : 'text-navy'}`}>{p.title}</p>
                <p className={`font-inter text-xs leading-relaxed mb-4 ${perfil === p.key ? 'text-white/60' : 'text-slate-500'}`}>{p.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map(t => (
                    <span key={t} className={`text-[10px] font-inter font-medium px-2 py-0.5 rounded-md ${
                      perfil === p.key ? 'bg-white/10 text-white/70' : 'bg-slate-100 text-slate-500'
                    }`}>{t}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIPOLOGÍAS DE ACTIVOS ─────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-10 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="label mb-3">Dónde invertir</p>
            <div className="w-7 h-[2px] bg-gold mb-5" />
            <h2 className="h2 leading-tight">Activos en los<br /><span className="text-gold italic">que trabajamos</span></h2>
            <p className="text-slate-500 font-inter text-sm leading-relaxed mt-4">
              Residencial, comercial o activos con valor añadido. Definimos juntos qué encaja mejor con tu perfil y objetivos.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {TIPOLOGIAS.map((t, i) => (
              <div key={i} className="group border border-slate-200 rounded-2xl p-6 hover:border-navy/20 hover:shadow-md transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                <div className="w-10 h-10 rounded-xl bg-navy/5 group-hover:bg-navy flex items-center justify-center mb-4 transition-colors duration-300">
                  <t.icon size={17} className="text-navy group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-inter font-bold text-navy text-sm mb-2">{t.title}</h3>
                <p className="text-slate-500 text-xs font-inter leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RENDIMIENTOS ──────────────────────────────────────────────── */}
      <section className="bg-navy py-24">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="label text-white/35 mb-3">Mercado actual</p>
              <div className="w-7 h-[2px] bg-gold mb-5" />
              <h2 className="h2 text-white leading-tight mb-4">
                Rendimientos<br /><span className="text-gold italic">orientativos</span>
              </h2>
              <p className="text-white/50 font-inter text-sm leading-relaxed mb-4">
                Los rendimientos varían según zona, estado del activo y estructura de la operación.
                Estos rangos son orientativos para Barcelona y área metropolitana en el contexto actual.
              </p>
              <p className="text-white/25 text-[11px] font-inter leading-relaxed">
                Renta neta: descontados gastos de explotación, vacíos y costes de compra.
                Retorno total: incluye revalorización estimada a 5 años.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-3 text-[10px] font-inter font-semibold uppercase tracking-wider text-white/30 px-5 py-3.5 border-b border-white/10">
                <span>Tipología</span>
                <span className="text-center">Renta neta</span>
                <span className="text-right">Retorno total</span>
              </div>
              {RENDIMIENTOS.map((r, i) => (
                <div key={i} className={`grid grid-cols-3 px-5 py-4 border-b border-white/5 last:border-0 ${i % 2 !== 0 ? 'bg-white/[0.02]' : ''}`}>
                  <span className="text-white/65 text-xs font-inter">{r.tipo}</span>
                  <span className="text-center text-gold text-xs font-inter font-bold tabular-nums">{r.renta}</span>
                  <span className="text-right text-gold text-xs font-inter font-bold tabular-nums">{r.total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GESTIÓN PATRIMONIAL ───────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-10 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="label mb-3">Si ya tienes activos</p>
            <div className="w-7 h-[2px] bg-gold mb-5" />
            <h2 className="h2 leading-tight">Gestión<br /><span className="text-gold italic">patrimonial</span></h2>
            <p className="text-slate-500 font-inter text-sm leading-relaxed mt-4">
              Para propietarios con dos o más inmuebles que quieren pasar de gestionar de forma reactiva a tener una estrategia clara.
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              {
                icon: Search,
                title: 'Diagnóstico de la cartera actual',
                body: 'Analizamos todos tus activos: rentabilidad real, cargas, situación jurídica y potencial de mejora. Muchos propietarios descubren que uno de sus pisos rinde mucho menos de lo que creían.',
              },
              {
                icon: PieChart,
                title: 'Estrategia de cartera',
                body: 'Diseñamos el mix óptimo de activos según tu perfil de riesgo, horizonte temporal y objetivos. Qué mantener, qué mejorar, qué rotar y qué adquirir.',
              },
              {
                icon: RefreshCw,
                title: 'Rotación y desinversión',
                body: 'Identificamos el momento óptimo para vender o rotar activos. Coordinamos la fiscalidad de la operación y la sustitución por nuevos activos si aplica.',
              },
              {
                icon: BarChart3,
                title: 'Reporting periódico',
                body: 'Informe mensual de cada activo y del conjunto: rendimiento por alquiler, revalorización, gastos y ROI total. Tomas decisiones con datos, no con intuición.',
              },
              {
                icon: Shield,
                title: 'Coordinación con tu equipo asesor',
                body: 'Trabajamos con tu abogado, asesor fiscal y arquitecto, o te recomendamos los nuestros. Cada decisión queda optimizada en todos los planos.',
              },
            ].map((item, i) => (
              <div key={i} className="py-8 first:pt-0 last:pb-0 flex gap-5 items-start">
                <div className="w-9 h-9 rounded-xl bg-navy/5 flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon size={15} className="text-navy" />
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

      {/* ── PROCESO ───────────────────────────────────────────────────── */}
      <section className="bg-slate-50 border-y border-slate-100 py-24">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 items-start">
            <div className="lg:sticky lg:top-28">
              <p className="label mb-3">Cómo trabajamos</p>
              <div className="w-7 h-[2px] bg-gold mb-5" />
              <h2 className="h2 leading-tight">Del mandato<br /><span className="text-gold italic">al cierre</span></h2>
              <p className="text-slate-500 font-inter text-sm leading-relaxed mt-4">
                Cuatro fases. En cada una sabrás qué está pasando y qué viene a continuación.
              </p>
            </div>
            <div className="space-y-0">
              {[
                { n: '01', icon: Target,    title: 'Definición del mandato',  time: 'Día 1',     desc: 'Sesión de trabajo para definir el perfil de inversión: tipología de activo, zona, rango de precio, rentabilidad mínima exigida y horizonte de salida. Sin coste.' },
                { n: '02', icon: Search,    title: 'Sourcing y análisis',     time: 'Semanas 1–4', desc: 'Búsqueda activa en mercado abierto y off-market. Prefiltrado de oportunidades y análisis rápido de las que encajan con el mandato. Solo te mostramos las que merecen tu tiempo.' },
                { n: '03', icon: BarChart3, title: 'Due diligence',           time: 'Semanas 2–6', desc: 'Análisis completo: rentabilidad, mercado comparativo, revisión técnica y jurídica-registral. Todo lo que necesitas saber antes de comprometerte.' },
                { n: '04', icon: FileCheck, title: 'Negociación y firma',     time: 'Cierre',      desc: 'Negociamos en tu nombre, coordinamos notaría y financiación si aplica. Te acompañamos hasta la firma y después, si la operación lo requiere.' },
              ].map((step, i, arr) => (
                <div key={i} className="flex gap-6 relative">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center z-10">
                      <step.icon size={15} className="text-white" />
                    </div>
                    {i < arr.length - 1 && (
                      <div className="w-px flex-1 bg-slate-200" style={{ minHeight: '40px' }} />
                    )}
                  </div>
                  <div className={`pb-10 flex-1 ${i === arr.length - 1 ? 'pb-0' : ''}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-inter font-bold text-navy text-sm">{step.title}</h3>
                      <span className="text-[10px] font-inter font-medium text-slate-400 bg-white border border-slate-200 px-2.5 py-1 rounded-full shrink-0 ml-3">
                        {step.time}
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm font-inter leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DUE DILIGENCE ─────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-10 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="label mb-3">Análisis previo</p>
            <div className="w-7 h-[2px] bg-gold mb-5" />
            <h2 className="h2 leading-tight">Lo que incluye<br /><span className="text-gold italic">el estudio</span></h2>
            <p className="text-slate-500 font-inter text-sm leading-relaxed mt-4">
              Antes de comprometerte con una operación, necesitas tener todos los datos. Este análisis está diseñado para eliminar sorpresas.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DUE_DILIGENCE.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl hover:border-navy/20 transition-colors">
                <CheckCircle size={13} className="text-gold mt-0.5 shrink-0" />
                <p className="text-slate-600 text-xs font-inter leading-snug">{item}</p>
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
            "En seis meses rotamos dos activos que no rendían y compramos uno nuevo
            off-market. La rentabilidad media de la cartera pasó del 3,2% al 5,8%."
          </blockquote>
          <p className="font-inter text-slate-400 text-sm tracking-wide">— Marc T., inversor con 4 activos en cartera</p>
        </div>
      </section>

      {/* ── CONTACTO DIRECTO ──────────────────────────────────────────── */}
      <section id="contacto-inversion" className="bg-navy py-24">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
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
