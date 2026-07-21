import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, BadgeCheck, TrendingDown, Search,
  FileCheck, Building2, CheckCircle, Info, Calculator,
  Euro
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// ── Mortgage calculator logic ─────────────────────────────────────────────
function calcHipoteca(principal: number, annualRate: number, years: number) {
  const r = annualRate / 100 / 12
  const n = years * 12
  if (r === 0) return { monthly: principal / n, totalInterest: 0, totalCost: principal }
  const monthly = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  const totalCost = monthly * n
  const totalInterest = totalCost - principal
  return { monthly, totalInterest, totalCost }
}

function fmtEur(n: number) {
  return new Intl.NumberFormat('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n) + '€'
}

const TIPOS_HIP = ['Fija', 'Variable', 'Mixta'] as const

const PASOS = [
  { num: '01', icon: Search, title: 'Análisis de tu perfil', desc: 'Estudiamos tu situación financiera, ingresos, ahorros y perfil de riesgo para definir el importe y plazo óptimo.' },
  { num: '02', icon: Building2, title: 'Consulta a 20+ bancos', desc: 'Accedemos a más de 20 entidades bancarias en tu nombre para obtener las mejores condiciones del mercado.' },
  { num: '03', icon: FileCheck, title: 'Comparativa real', desc: 'Te presentamos las mejores ofertas con análisis comparativo (TAE, vinculaciones, comisiones) para que decidas con criterio.' },
  { num: '04', icon: CheckCircle, title: 'Gestión y firma', desc: 'Coordinamos toda la documentación y te acompañamos hasta la firma ante notario.' },
]

const VENTAJAS = [
  'Acceso a más de 20 bancos en una sola consulta',
  'Negociamos condiciones que no están en el mercado abierto',
  'Sin coste para el cliente: cobramos al banco, no a ti',
  'Ahorro medio de 20.000€ en intereses vs. ir directo',
  'Respuesta en 24-48h con oferta personalizada',
  'Servicio para asalariados, autónomos y no residentes',
]

const FAQS = [
  { q: '¿Cuánto cuesta el servicio?', a: 'En la mayoría de los casos, el servicio es gratuito para el cliente. Cobramos una comisión al banco, sin costes adicionales para ti.' },
  { q: '¿Cuánto tarda el proceso?', a: 'Desde que nos facilitas la documentación hasta recibir oferta vinculante: 5-15 días laborables.' },
  { q: '¿Qué documentación necesito?', a: 'DNI, últimas 3 nóminas o declaración de renta, extracto bancario 6 meses, contrato de trabajo y nota simple del inmueble.' },
  { q: '¿Trabajáis con autónomos?', a: 'Sí. Tenemos experiencia con autónomos, SL, y también con no residentes que quieren comprar en España.' },
]

type TipoHip = typeof TIPOS_HIP[number]
type ContratoTipo = 'Asalariado' | 'Autónomo' | 'Funcionario' | 'Empresa'

export default function Hipotecas() {
  // Simulator state
  const [loanAmt, setLoanAmt]   = useState(300000)
  const [rate, setRate]         = useState(3.5)
  const [years, setYears]       = useState(25)
  const [tipoHip, setTipoHip]   = useState<TipoHip>('Fija')

  const result = useMemo(() => calcHipoteca(loanAmt, rate, years), [loanAmt, rate, years])
  const pctInterest = ((result.totalInterest / result.totalCost) * 100).toFixed(0)

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="h-[64px]" />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative bg-navy overflow-hidden pt-20 pb-12">
        <div className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=1920&q=80')" }} />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-dark/98 via-navy/95 to-navy-light/90" />
        <div className="absolute right-0 top-0 w-1/3 h-full pointer-events-none opacity-[0.04]">
          <div className="absolute top-10 right-20 w-px h-72 bg-white" />
          <div className="absolute top-32 right-48 w-48 h-px bg-white" />
        </div>
        <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="pt-4">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-7 h-[2px] bg-gold" />
                <p className="label text-white/40">Hipotecas · Financiación</p>
              </div>
              <h1 className="h1 text-white mb-5">
                La mejor hipoteca<br />
                <span className="text-gold italic">para tu perfil.</span>
              </h1>
              <p className="text-white/55 font-inter text-base font-light leading-relaxed max-w-lg mb-8">
                Negociamos con más de 20 bancos para conseguirte las mejores condiciones. Sin coste para ti, ahorro medio de 20.000€ frente a negociar solo.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { value: '20+', label: 'Bancos' },
                  { value: '0€', label: 'Coste' },
                  { value: '20k€', label: 'Ahorro medio' },
                  { value: '48h', label: 'Primera oferta' },
                ].map((s, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center">
                    <p className="font-inter font-black text-gold text-xl">{s.value}</p>
                    <p className="text-white/40 text-[10px] font-inter uppercase tracking-wider mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── SIMULATOR ────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-5">
                <Calculator size={18} className="text-navy" />
                <p className="font-inter font-bold text-navy text-base">Simulador de hipoteca</p>
              </div>

              {/* Tipo hipoteca */}
              <div className="flex gap-2 mb-5">
                {TIPOS_HIP.map(t => (
                  <button
                    key={t}
                    onClick={() => setTipoHip(t)}
                    className={`flex-1 py-2 rounded-xl text-xs font-inter font-semibold border transition-all ${
                      tipoHip === t ? 'bg-navy text-white border-navy' : 'border-slate-200 text-slate-500 hover:border-navy/40'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Importe */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="label-field">Importe del préstamo</label>
                  <span className="font-inter font-bold text-navy text-sm tabular-nums">{fmtEur(loanAmt)}</span>
                </div>
                <input type="range" min={50000} max={2000000} step={10000}
                  value={loanAmt} onChange={e => setLoanAmt(Number(e.target.value))}
                  className="w-full" />
                <div className="flex justify-between text-[10px] font-inter text-slate-300 mt-1">
                  <span>50.000€</span><span>2.000.000€</span>
                </div>
              </div>

              {/* Rate + Years */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="label-field">Tipo interés</label>
                    <span className="font-inter font-bold text-navy text-sm">{rate.toFixed(2)}%</span>
                  </div>
                  <input type="range" min={1} max={8} step={0.05}
                    value={rate} onChange={e => setRate(Number(e.target.value))}
                    className="w-full" />
                  <div className="flex justify-between text-[10px] font-inter text-slate-300 mt-1">
                    <span>1%</span><span>8%</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="label-field">Plazo</label>
                    <span className="font-inter font-bold text-navy text-sm">{years} años</span>
                  </div>
                  <input type="range" min={5} max={30} step={1}
                    value={years} onChange={e => setYears(Number(e.target.value))}
                    className="w-full" />
                  <div className="flex justify-between text-[10px] font-inter text-slate-300 mt-1">
                    <span>5 años</span><span>30 años</span>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="bg-navy rounded-xl p-4 mb-4">
                <p className="text-white/50 text-[10px] font-inter uppercase tracking-wider mb-3">Cuota mensual estimada</p>
                <p className="font-inter font-black text-gold text-4xl tabular-nums mb-3">
                  {fmtEur(Math.round(result.monthly))}
                  <span className="text-lg font-medium text-white/50">/mes</span>
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-white/40 text-[10px] font-inter">Total intereses</p>
                    <p className="font-inter font-bold text-white text-sm tabular-nums">{fmtEur(Math.round(result.totalInterest))}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] font-inter">Coste total</p>
                    <p className="font-inter font-bold text-white text-sm tabular-nums">{fmtEur(Math.round(result.totalCost))}</p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] font-inter text-white/40 mb-1">
                    <span>Capital {(100 - Number(pctInterest))}%</span>
                    <span>Intereses {pctInterest}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gold rounded-full transition-all duration-500"
                      style={{ width: `${100 - Number(pctInterest)}%` }} />
                  </div>
                </div>
              </div>

              <p className="text-slate-400 text-[10px] font-inter text-center">
                Simulación orientativa. Tipo hipoteca: {tipoHip}. Consulta con un asesor para condiciones reales.
              </p>

              <Link to="#contacto-hipotecas" className="btn-primary w-full justify-center mt-3">
                Conseguir mi hipoteca real <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESO ─────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-10 py-20">
        <div className="text-center mb-12">
          <p className="label mb-3">Metodología</p>
          <div className="w-8 h-[2px] bg-gold mx-auto mb-5" />
          <h2 className="h2">Tu hipoteca en<br /><span className="text-gold italic">4 pasos</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {PASOS.map((p, i) => (
            <div key={i} className="group card hover:border-navy/20 flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold transition-colors duration-300">
                  <p.icon size={15} className="text-gold group-hover:text-navy transition-colors duration-300" />
                </div>
                <span className="font-inter font-black text-4xl text-navy/8">{p.num}</span>
              </div>
              <div>
                <h3 className="font-inter font-bold text-navy text-sm mb-1.5">{p.title}</h3>
                <p className="text-slate-500 text-xs font-inter leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── VENTAJAS + FAQ ─────────────────────────────────────── */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="label mb-3">Por qué elegirnos</p>
              <div className="w-8 h-[2px] bg-gold mb-6" />
              <h2 className="h2 mb-8">Ventajas de trabajar<br /><span className="text-gold italic">con qimmo</span></h2>
              <div className="space-y-3">
                {VENTAJAS.map((v, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white border border-slate-100 rounded-xl p-4 hover:border-gold/30 hover:shadow-sm transition-all">
                    <BadgeCheck size={14} className="text-gold mt-0.5 shrink-0" />
                    <p className="text-slate-700 text-sm font-inter">{v}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="label mb-3">FAQ</p>
              <div className="w-8 h-[2px] bg-navy mb-6" />
              <div className="space-y-3">
                {FAQS.map((f, i) => (
                  <div key={i} className="bg-white border border-slate-100 rounded-xl p-5">
                    <div className="flex items-start gap-2.5 mb-2">
                      <Info size={14} className="text-gold mt-0.5 shrink-0" />
                      <p className="font-inter font-semibold text-navy text-sm">{f.q}</p>
                    </div>
                    <p className="text-slate-500 text-xs font-inter leading-relaxed pl-6">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACTO DIRECTO ─────────────────────────────────────── */}
      <section id="contacto-hipotecas" className="max-w-screen-xl mx-auto px-6 lg:px-10 py-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="label mb-3">Consulta personalizada</p>
            <div className="w-8 h-[2px] bg-gold mx-auto mb-5" />
            <h2 className="h2 mb-3">Encuentra tu hipoteca ideal</h2>
            <p className="text-slate-500 font-inter text-sm">Cuéntanos tu situación y en 24h te presentamos las mejores opciones del mercado.</p>
          </div>

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
      </section>

      <Footer />
    </div>
  )
}
