import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, BadgeCheck, Search,
  FileCheck, Building2, CheckCircle, Info, Calculator,
  Shield
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
type TipoHip = typeof TIPOS_HIP[number]

const BANCOS = [
  { name: 'CaixaBank',   domain: 'caixabank.com' },
  { name: 'BBVA',        domain: 'bbva.es' },
  { name: 'Sabadell',    domain: 'bancsabadell.com' },
  { name: 'UCI',         domain: 'uci.com' },
]

const SEGUROS = [
  {
    name: 'SEAG',
    full: 'Seguro de Impago de Alquiler',
    domain: 'seag.es',
    desc: 'Seguro de impago de alquiler. Protege al propietario frente a inquilinos morosos, cubriendo rentas impagadas y gastos jurídicos.',
    color: '#1a3a5c',
  },
  {
    name: 'MAPFRE',
    full: 'Seguros de Hogar y Vida',
    domain: 'mapfre.es',
    desc: 'Seguros de hogar, vida y protección de pagos. Coberturas completas para propietarios, compradores y arrendatarios.',
    color: '#d01012',
  },
]

const PASOS = [
  { num: '01', icon: Search,       title: 'Análisis de tu perfil',    desc: 'Estudiamos tu situación financiera, ingresos, ahorros y perfil de riesgo para definir el importe y plazo óptimo.' },
  { num: '02', icon: Building2,    title: 'Propuestas de bancos',      desc: 'Presentamos tu operación a CaixaBank, BBVA, Sabadell, UCI y otras entidades para obtener las mejores condiciones.' },
  { num: '03', icon: FileCheck,    title: 'Comparativa real',          desc: 'Te presentamos las mejores ofertas con análisis de TAE, vinculaciones y comisiones para que decidas con criterio.' },
  { num: '04', icon: CheckCircle,  title: 'Gestión y firma',           desc: 'Coordinamos toda la documentación y te acompañamos hasta la firma ante notario.' },
]

const VENTAJAS = [
  'Presentamos propuestas a bancos competitivos: CaixaBank, BBVA, Sabadell y UCI',
  'Negociamos condiciones que no están en el mercado abierto',
  'Sin coste para el cliente: cobramos al banco, no a ti',
  'Respuesta en 24-48h con oferta personalizada',
  'Servicio para asalariados, autónomos y no residentes',
  'Coordinación completa hasta firma ante notario',
]

const FAQS = [
  { q: '¿Cuánto cuesta el servicio?', a: 'En la mayoría de los casos, el servicio es gratuito para el cliente. Cobramos una comisión al banco, sin costes adicionales para ti.' },
  { q: '¿Cuánto tarda el proceso?', a: 'Desde que nos facilitas la documentación hasta recibir oferta vinculante: 5-15 días laborables.' },
  { q: '¿Qué documentación necesito?', a: 'DNI, últimas 3 nóminas o declaración de renta, extracto bancario 6 meses, contrato de trabajo y nota simple del inmueble.' },
  { q: '¿Trabajáis con autónomos?', a: 'Sí. Tenemos experiencia con autónomos, SL, y también con no residentes que quieren comprar en España.' },
]

function LogoImg({ domain, name, size = 28 }: { domain: string; name: string; size?: number }) {
  return (
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt={name}
      width={size}
      height={size}
      className="object-contain"
      style={{ maxHeight: size }}
      onError={e => {
        const el = e.currentTarget
        el.style.display = 'none'
        const span = document.createElement('span')
        span.className = 'font-jakarta font-bold text-navy text-xs'
        span.textContent = name
        el.parentElement?.appendChild(span)
      }}
    />
  )
}

export default function Hipotecas() {
  const [loanAmt, setLoanAmt] = useState(300000)
  const [rate, setRate]       = useState(3.5)
  const [years, setYears]     = useState(25)
  const [tipoHip, setTipoHip] = useState<TipoHip>('Fija')

  const result      = useMemo(() => calcHipoteca(loanAmt, rate, years), [loanAmt, rate, years])
  const pctInterest = ((result.totalInterest / result.totalCost) * 100).toFixed(0)

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F6F2' }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="pt-16" style={{ background: '#0D1F3C' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="label mb-4" style={{ color: '#C49A3C' }}>Hipotecas · Seguros</p>
              <h1 className="h1 text-white mb-5">
                La mejor hipoteca<br />para tu perfil.
              </h1>
              <p className="font-inter text-lg leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Presentamos tu operación a los bancos más competitivos del mercado — CaixaBank, BBVA, Sabadell y UCI — para conseguirte las mejores condiciones. Sin coste para ti.
              </p>

              {/* Bank logos */}
              <div className="mb-8">
                <p className="font-inter text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.30)' }}>
                  Bancos colaboradores
                </p>
                <div className="flex flex-wrap gap-3">
                  {BANCOS.map(b => (
                    <div key={b.name}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
                      <LogoImg domain={b.domain} name={b.name} size={20} />
                      <span className="font-inter font-semibold text-sm text-white">{b.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { value: '4',   label: 'Bancos top' },
                  { value: '0€',  label: 'Coste para ti' },
                  { value: '48h', label: 'Primera oferta' },
                  { value: '100%',label: 'Gestión completa' },
                ].map((s, i) => (
                  <div key={i} className="text-center px-3 py-4 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <p className="font-jakarta font-black text-2xl mb-0.5" style={{ color: '#C49A3C' }}>{s.value}</p>
                    <p className="font-inter text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── SIMULATOR ─── */}
            <div className="bg-white rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-5">
                <Calculator size={18} style={{ color: '#0D1F3C' }} />
                <p className="font-jakarta font-bold text-navy text-base">Simulador de hipoteca</p>
              </div>

              <div className="flex gap-2 mb-5">
                {TIPOS_HIP.map(t => (
                  <button
                    key={t}
                    onClick={() => setTipoHip(t)}
                    className="flex-1 py-2 rounded-xl text-xs font-inter font-semibold border transition-all"
                    style={{
                      background: tipoHip === t ? '#0D1F3C' : 'transparent',
                      color: tipoHip === t ? 'white' : '#6B7280',
                      borderColor: tipoHip === t ? '#0D1F3C' : '#E2E0DA',
                    }}
                  >{t}</button>
                ))}
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="font-inter text-xs font-semibold text-navy">Importe del préstamo</label>
                  <span className="font-jakarta font-bold text-navy text-sm tabular-nums">{fmtEur(loanAmt)}</span>
                </div>
                <input type="range" min={50000} max={2000000} step={10000}
                  value={loanAmt} onChange={e => setLoanAmt(Number(e.target.value))}
                  className="w-full accent-navy" style={{ accentColor: '#0D1F3C' }} />
                <div className="flex justify-between text-[10px] font-inter mt-1" style={{ color: '#C4C0B8' }}>
                  <span>50.000€</span><span>2.000.000€</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-inter text-xs font-semibold text-navy">Tipo interés</label>
                    <span className="font-jakarta font-bold text-navy text-sm">{rate.toFixed(2)}%</span>
                  </div>
                  <input type="range" min={1} max={8} step={0.05}
                    value={rate} onChange={e => setRate(Number(e.target.value))}
                    className="w-full" style={{ accentColor: '#0D1F3C' }} />
                  <div className="flex justify-between text-[10px] font-inter mt-1" style={{ color: '#C4C0B8' }}>
                    <span>1%</span><span>8%</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-inter text-xs font-semibold text-navy">Plazo</label>
                    <span className="font-jakarta font-bold text-navy text-sm">{years} años</span>
                  </div>
                  <input type="range" min={5} max={30} step={1}
                    value={years} onChange={e => setYears(Number(e.target.value))}
                    className="w-full" style={{ accentColor: '#0D1F3C' }} />
                  <div className="flex justify-between text-[10px] font-inter mt-1" style={{ color: '#C4C0B8' }}>
                    <span>5 años</span><span>30 años</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl p-4 mb-4" style={{ background: '#0D1F3C' }}>
                <p className="font-inter text-[10px] uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.40)' }}>
                  Cuota mensual estimada
                </p>
                <p className="font-jakarta font-black text-4xl tabular-nums mb-3" style={{ color: '#C49A3C' }}>
                  {fmtEur(Math.round(result.monthly))}
                  <span className="text-lg font-medium" style={{ color: 'rgba(255,255,255,0.40)' }}>/mes</span>
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="font-inter text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Total intereses</p>
                    <p className="font-jakarta font-bold text-white text-sm tabular-nums">{fmtEur(Math.round(result.totalInterest))}</p>
                  </div>
                  <div>
                    <p className="font-inter text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Coste total</p>
                    <p className="font-jakarta font-bold text-white text-sm tabular-nums">{fmtEur(Math.round(result.totalCost))}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] font-inter mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    <span>Capital {100 - Number(pctInterest)}%</span>
                    <span>Intereses {pctInterest}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.10)' }}>
                    <div className="h-full rounded-full transition-all duration-500" style={{ background: '#C49A3C', width: `${100 - Number(pctInterest)}%` }} />
                  </div>
                </div>
              </div>

              <p className="font-inter text-[10px] text-center mb-3" style={{ color: '#9CA3AF' }}>
                Simulación orientativa. Tipo: {tipoHip}. Consulta con un asesor para condiciones reales.
              </p>
              <a href="#contacto-hip" className="btn-primary w-full justify-center">
                Solicitar mi hipoteca <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESO ─────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-12">
            <p className="label mb-4">Metodología</p>
            <h2 className="h2 text-navy">Tu hipoteca en 4 pasos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {PASOS.map((p, i) => (
              <div key={i} className="card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#F0F4FA' }}>
                    <p.icon size={15} style={{ color: '#0D1F3C' }} />
                  </div>
                  <span className="font-jakarta font-black text-3xl leading-none" style={{ color: '#E2E0DA' }}>{p.num}</span>
                </div>
                <p className="font-jakarta font-bold text-navy text-sm mb-2">{p.title}</p>
                <p className="font-inter text-xs leading-relaxed" style={{ color: '#6B7280' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VENTAJAS + FAQ ─────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#F7F6F2' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="label mb-4">Ventajas</p>
              <h2 className="h2 text-navy mb-8">Por qué trabajar conmigo</h2>
              <div className="space-y-3">
                {VENTAJAS.map((v, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white" style={{ border: '1px solid #E2E0DA' }}>
                    <BadgeCheck size={14} style={{ color: '#C49A3C', marginTop: '2px', flexShrink: 0 }} />
                    <p className="font-inter text-sm leading-relaxed" style={{ color: '#4B5563' }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="label mb-4">FAQ</p>
              <h2 className="h2 text-navy mb-8">Preguntas frecuentes</h2>
              <div className="space-y-3">
                {FAQS.map((f, i) => (
                  <div key={i} className="card">
                    <div className="flex items-start gap-2.5 mb-2">
                      <Info size={14} style={{ color: '#C49A3C', marginTop: '2px', flexShrink: 0 }} />
                      <p className="font-jakarta font-bold text-navy text-sm">{f.q}</p>
                    </div>
                    <p className="font-inter text-xs leading-relaxed pl-6" style={{ color: '#6B7280' }}>{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEGUROS ─────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-12">
            <p className="label mb-4">Seguros</p>
            <h2 className="h2 text-navy mb-3">Protección para tu inmueble</h2>
            <p className="font-inter text-base leading-relaxed max-w-xl" style={{ color: '#6B7280' }}>
              Somos colaboradores de las aseguradoras líderes en el sector inmobiliario. Te ofrecemos cobertura completa para alquiler, compraventa y patrimonio.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SEGUROS.map(s => (
              <div key={s.name} className="card flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
                    style={{ background: '#F7F6F2', border: '1px solid #E2E0DA' }}>
                    <img
                      src={`https://logo.clearbit.com/${s.domain}`}
                      alt={s.name}
                      className="w-9 h-9 object-contain"
                      onError={e => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-jakarta font-bold text-navy text-lg">{s.name}</p>
                    <p className="font-inter text-xs font-semibold uppercase tracking-wide" style={{ color: '#C49A3C' }}>{s.full}</p>
                  </div>
                </div>
                <p className="font-inter text-sm leading-relaxed" style={{ color: '#4B5563' }}>{s.desc}</p>
                <div className="flex items-center gap-2 mt-auto pt-2">
                  <Shield size={13} style={{ color: '#C49A3C' }} />
                  <span className="font-inter text-xs font-semibold" style={{ color: '#C49A3C' }}>Colaborador oficial</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACTO ─────────────────────────────────────────────── */}
      <section id="contacto-hip" className="py-20" style={{ background: '#0D1F3C' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <p className="label mb-4" style={{ color: '#C49A3C' }}>Consulta personalizada</p>
          <h2 className="h2 text-white mb-4">Cuéntame tu situación</h2>
          <p className="font-inter mb-8 max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.55)' }}>
            En 24-48h te presento las propuestas reales de los bancos para tu perfil. Sin compromiso.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="tel:+34609019160" className="btn-primary" style={{ background: '#C49A3C' }}>
              609 019 160 <ArrowRight size={15} />
            </a>
            <a href="https://wa.me/34609019160" target="_blank" rel="noopener noreferrer"
              className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.25)', color: 'white' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
              WhatsApp
            </a>
            <Link to="/contacto"
              className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.25)', color: 'white' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
              Escribir mensaje
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
