import { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, MapPin, Maximize2, BedDouble, Bath, Car, TreePine,
  Heart, Share, ChevronLeft, ChevronRight, CheckCircle, Phone,
  Mail, Calendar, ArrowRight, BadgeCheck,
  Train, ShoppingBag, Coffee, Building2, Calculator, Loader2
} from 'lucide-react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase, supabaseReady, type Propiedad } from '../lib/supabase'

// ── Dot marker for location map ───────────────────────────────────────────
const dotMarker = L.divIcon({
  className: '',
  html: `<div style="width:16px;height:16px;background:#1A2744;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(26,39,68,0.4)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

const ENERGY_COLOR: Record<string, string> = {
  A: 'bg-green-500', B: 'bg-lime-500', C: 'bg-yellow-400 text-slate-900',
  D: 'bg-orange-400', E: 'bg-orange-500', F: 'bg-red-500', G: 'bg-red-700',
}

function fmt(n: number) {
  return new Intl.NumberFormat('es-ES').format(n) + '€'
}

// ── Mortgage calculator ───────────────────────────────────────────────────
function calcHipoteca(principal: number, annualRate: number, years: number) {
  if (annualRate === 0 || principal <= 0) return { monthly: 0, total: 0, interest: 0 }
  const r = annualRate / 100 / 12
  const n = years * 12
  const monthly = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  const total = monthly * n
  return { monthly, total, interest: total - principal }
}

// ── Purchase costs (Cataluña) ─────────────────────────────────────────────
function calcGastos(precio: number) {
  const itp      = precio * 0.10     // ITP Cataluña 10%
  const notaria  = Math.max(precio * 0.004, 800)
  const registro = Math.max(precio * 0.002, 400)
  const gestoria = 500
  const tasacion = 450
  return { itp, notaria, registro, gestoria, tasacion, total: itp + notaria + registro + gestoria + tasacion }
}

// ── Neighbourhood amenities (generic Barcelona) ───────────────────────────
const AMENITIES = [
  { icon: Train,       label: 'Transporte',    value: 'Metro/bus < 5 min' },
  { icon: ShoppingBag, label: 'Supermercados', value: '< 3 min a pie' },
  { icon: TreePine,    label: 'Parques',        value: '< 8 min a pie' },
  { icon: Coffee,      label: 'Restaurantes',   value: '10+ en la zona' },
  { icon: Building2,   label: 'Centros salud',  value: 'CAP en el barrio' },
  { icon: Car,         label: 'Aparcamiento',   value: 'Zona regulada' },
]

export default function PropiedadDetalle() {
  const { ref } = useParams<{ ref: string }>()
  const navigate = useNavigate()
  const [propiedad, setPropiedad] = useState<Propiedad | null | undefined>(undefined)
  const [similar, setSimilar]     = useState<Propiedad[]>([])

  const [imgIdx, setImgIdx]       = useState(0)
  const [saved, setSaved]         = useState(false)

  const [hipEntrada, setHipEntrada] = useState(20)
  const [hipTipo, setHipTipo]       = useState(3.5)
  const [hipAnos, setHipAnos]       = useState(25)

  useEffect(() => { window.scrollTo(0, 0) }, [ref])

  useEffect(() => {
    if (!ref) return
    if (!supabaseReady) { setPropiedad(null); return }
    supabase.from('propiedades').select('*').eq('ref', ref).eq('publicado', true).single()
      .then(({ data }) => {
        const p = data as Propiedad | null
        setPropiedad(p)
        if (p) {
          supabase.from('propiedades').select('*').eq('publicado', true).eq('tipo', p.tipo).neq('ref', ref).limit(3)
            .then(({ data: sim }) => setSimilar((sim ?? []) as Propiedad[]))
        }
      })
  }, [ref])

  if (propiedad === undefined) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={28} className="animate-spin" style={{ color: '#C49A3C' }} />
        </div>
        <Footer />
      </div>
    )
  }

  if (!propiedad) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="font-inter font-semibold text-navy text-xl mb-3">Propiedad no encontrada</p>
            <Link to="/buscar" className="btn-primary">Ver todas las propiedades</Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const p: Propiedad = propiedad
  const pm2 = Math.round(p.precio / p.m2)
  const imgs = p.imagenes && p.imagenes.length > 0 ? p.imagenes : [p.imagen]

  const hipPrincipal = useMemo(() => p.precio * (1 - hipEntrada / 100), [p.precio, hipEntrada])
  const hipResult    = useMemo(() => calcHipoteca(hipPrincipal, hipTipo, hipAnos), [hipPrincipal, hipTipo, hipAnos])
  const gastos       = useMemo(() => calcGastos(p.precio), [p.precio])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="h-[80px]" />

      {/* ── BREADCRUMB ─────────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-3 flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm font-inter text-slate-500 hover:text-navy transition-colors"
        >
          <ArrowLeft size={15} /> Volver
        </button>
        <span className="text-slate-300">/</span>
        <Link to="/buscar" className="text-sm font-inter text-slate-500 hover:text-navy transition-colors">Propiedades</Link>
        <span className="text-slate-300">/</span>
        <span className="text-sm font-inter text-navy font-medium truncate max-w-[200px]">{p.titulo}</span>
      </div>

      {/* ── GALLERY ────────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 lg:px-8 mb-8">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden h-[420px] md:h-[480px]">
          {/* Main image */}
          <div className="col-span-4 md:col-span-3 row-span-2 relative group">
            <img
              src={imgs[imgIdx]}
              alt={p.titulo}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            {/* Nav arrows */}
            {imgs.length > 1 && (
              <>
                <button
                  onClick={() => setImgIdx(i => (i - 1 + imgs.length) % imgs.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft size={18} className="text-navy" />
                </button>
                <button
                  onClick={() => setImgIdx(i => (i + 1) % imgs.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight size={18} className="text-navy" />
                </button>
              </>
            )}
            {/* Img counter */}
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-inter px-2.5 py-1 rounded-full">
              {imgIdx + 1} / {imgs.length}
            </div>
            {/* Actions */}
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={() => setSaved(s => !s)}
                className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all ${
                  saved ? 'bg-red-500 text-white' : 'bg-white/90 text-slate-600 hover:text-red-500'
                }`}
              >
                <Heart size={15} fill={saved ? 'currentColor' : 'none'} />
              </button>
              <button className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md text-slate-600 hover:text-navy transition-all">
                <Share size={15} />
              </button>
            </div>
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              <span className="bg-white/95 text-navy text-[11px] font-inter font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                {p.tipo}
              </span>
              {p.badge && (
                <span className={`text-[11px] font-inter font-bold px-2.5 py-1 rounded-lg ${
                  p.badge === 'Off-market' ? 'bg-slate-900 text-[#C8A96E]' :
                  p.badge === 'Inversión' ? 'bg-[#C8A96E] text-navy' :
                  p.badge === 'Nueva incorporación' ? 'bg-navy text-white' :
                  'bg-red-500 text-white'
                }`}>
                  {p.badge}
                </span>
              )}
            </div>
          </div>
          {/* Thumbnail grid */}
          <div className="hidden md:flex flex-col gap-2 col-span-1 row-span-2">
            {imgs.slice(1, 3).map((img, i) => (
              <div
                key={i}
                className={`flex-1 relative cursor-pointer overflow-hidden rounded-lg ${imgIdx === i + 1 ? 'ring-2 ring-navy' : ''}`}
                onClick={() => setImgIdx(i + 1)}
              >
                <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
            {imgs.length > 3 && (
              <div
                className="relative cursor-pointer overflow-hidden rounded-lg flex items-center justify-center bg-slate-900"
                onClick={() => setImgIdx(3)}
              >
                <img src={imgs[3]} alt="" className="w-full h-full object-cover opacity-40" />
                <span className="absolute text-white font-inter font-semibold text-sm">+{imgs.length - 3} más</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ───────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT — Details */}
          <div className="lg:col-span-2 space-y-8">

            {/* Title + Location */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-inter font-semibold uppercase tracking-wider text-slate-400">{p.zona}</span>
                <span className="text-slate-200">·</span>
                <span className="text-[10px] font-inter text-slate-400">{p.ref}</span>
              </div>
              <h1 className="font-inter font-bold text-navy text-2xl md:text-3xl leading-tight mb-3">{p.titulo}</h1>
              <div className="flex items-center gap-1.5 text-slate-500">
                <MapPin size={14} className="text-gold shrink-0" />
                <span className="font-inter text-sm">{p.direccion}, {p.barrio}</span>
              </div>
            </div>

            {/* Key specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Superficie', value: `${p.m2} m²`, sub: `${fmt(Math.round(p.precio / p.m2))}/m²` },
                ...(p.habitaciones !== undefined ? [{ label: 'Habitaciones', value: `${p.habitaciones}`, sub: 'dormitorios' }] : []),
                ...(p.banos !== undefined ? [{ label: 'Baños', value: `${p.banos}`, sub: 'completos' }] : []),
                ...(p.planta ? [{ label: 'Planta', value: p.planta, sub: 'nivel' }] : []),
              ].map((s, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-[10px] font-inter font-semibold uppercase tracking-wider text-slate-400 mb-1">{s.label}</p>
                  <p className="font-inter font-bold text-navy text-xl">{s.value}</p>
                  {s.sub && <p className="text-[11px] text-slate-400 font-inter mt-0.5">{s.sub}</p>}
                </div>
              ))}
            </div>

            {/* Features */}
            <div>
              <h2 className="font-inter font-bold text-navy text-base mb-4">Características</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  ...(p.terraza ? ['Terraza'] : []),
                  ...(p.garage ? ['Garaje'] : []),
                  ...(p.ascensor ? ['Ascensor'] : []),
                  ...(p.piscina ? ['Piscina'] : []),
                  ...p.caracteristicas,
                ].map((f, i) => (
                  <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-inter text-slate-700 font-medium">
                    <BadgeCheck size={11} className="text-gold" />{f}
                  </span>
                ))}
                {/* Energy */}
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-inter font-bold text-white ${ENERGY_COLOR[p.energia]}`}>
                  Energía {p.energia}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-inter font-bold text-navy text-base mb-3">Descripción</h2>
              <p className="font-inter text-slate-600 text-sm leading-relaxed">{p.descripcion}</p>
            </div>

            {/* ── QUÉ HAY POR LA ZONA ──────────────────────────────── */}
            <div>
              <h2 className="font-inter font-bold text-navy text-base mb-4">Qué hay por la zona</h2>
              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-navy rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={15} className="text-white" />
                  </div>
                  <div>
                    <p className="font-inter font-bold text-navy text-sm">{p.barrio}</p>
                    <p className="text-slate-400 text-xs font-inter">{p.zona}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                  {AMENITIES.map((a, i) => (
                    <div key={i} className="flex items-center gap-2.5 bg-white border border-slate-100 rounded-xl p-3 hover:border-navy/20 transition-colors">
                      <div className="w-7 h-7 bg-navy/5 rounded-lg flex items-center justify-center shrink-0">
                        <a.icon size={13} className="text-navy" />
                      </div>
                      <div>
                        <p className="font-inter font-semibold text-navy text-[11px]">{a.label}</p>
                        <p className="text-slate-400 text-[10px] font-inter">{a.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['Bien comunicado', 'Zona residencial', 'Servicios completos', 'Buena conectividad', 'Transporte público'].map((tag, i) => (
                    <span key={i} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-500 text-[10px] font-inter rounded-lg font-medium">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── SIMULADOR DE HIPOTECA ─────────────────────────────── */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <Calculator size={16} className="text-navy" />
                <h2 className="font-inter font-bold text-navy text-base">Simula tu hipoteca</h2>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5">
                {/* Result summary */}
                <div className="bg-navy rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white/50 text-[11px] font-inter uppercase tracking-wider mb-1">Cuota mensual estimada</p>
                    <p className="font-inter font-black text-gold text-3xl tabular-nums">
                      {hipResult.monthly > 0 ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(hipResult.monthly) : '—'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/50 text-[10px] font-inter uppercase tracking-wider mb-1">Capital a financiar</p>
                    <p className="font-inter font-bold text-white text-sm tabular-nums">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(hipPrincipal)}
                    </p>
                  </div>
                </div>

                {/* Sliders */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="label-field mb-0">Entrada</label>
                      <span className="font-inter font-bold text-navy text-sm">{hipEntrada}%
                        <span className="text-slate-400 font-normal text-xs ml-1 tabular-nums">
                          ({new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(p.precio * hipEntrada / 100)})
                        </span>
                      </span>
                    </div>
                    <input type="range" min={5} max={50} step={5} value={hipEntrada}
                      onChange={e => setHipEntrada(Number(e.target.value))} className="w-full" />
                    <div className="flex justify-between text-[10px] text-slate-400 font-inter mt-0.5"><span>5%</span><span>50%</span></div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="label-field mb-0">Tipo de interés anual</label>
                      <span className="font-inter font-bold text-navy text-sm">{hipTipo.toFixed(1)}%</span>
                    </div>
                    <input type="range" min={1} max={7} step={0.1} value={hipTipo}
                      onChange={e => setHipTipo(Number(e.target.value))} className="w-full" />
                    <div className="flex justify-between text-[10px] text-slate-400 font-inter mt-0.5"><span>1%</span><span>7%</span></div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="label-field mb-0">Plazo</label>
                      <span className="font-inter font-bold text-navy text-sm">{hipAnos} años</span>
                    </div>
                    <input type="range" min={10} max={30} step={5} value={hipAnos}
                      onChange={e => setHipAnos(Number(e.target.value))} className="w-full" />
                    <div className="flex justify-between text-[10px] text-slate-400 font-inter mt-0.5"><span>10 años</span><span>30 años</span></div>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="border-t border-slate-100 pt-4 grid grid-cols-3 gap-3">
                  {[
                    { label: 'Capital', value: new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(hipPrincipal) },
                    { label: 'Intereses', value: new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(hipResult.interest) },
                    { label: 'Total', value: new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(hipResult.total) },
                  ].map((s, i) => (
                    <div key={i} className="text-center">
                      <p className="text-slate-400 text-[10px] font-inter uppercase tracking-wider mb-0.5">{s.label}</p>
                      <p className="font-inter font-bold text-navy text-sm tabular-nums">{s.value}</p>
                    </div>
                  ))}
                </div>
                <p className="text-slate-400 text-[10px] font-inter text-center">Estimación orientativa. Consulta con nuestros asesores hipotecarios.</p>
              </div>
            </div>

            {/* ── GASTOS DE COMPRA ──────────────────────────────────── */}
            <div>
              <h2 className="font-inter font-bold text-navy text-base mb-4">Gastos de compra estimados</h2>
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {[
                    { label: 'ITP — Impuesto Transmisiones Patrimoniales', pct: '10%', value: gastos.itp, note: 'Cataluña, 2ª mano' },
                    { label: 'Notaría', pct: '~0.4%', value: gastos.notaria, note: 'Escritura pública' },
                    { label: 'Registro de la Propiedad', pct: '~0.2%', value: gastos.registro, note: 'Inscripción registral' },
                    { label: 'Gestoría', pct: 'fijo', value: gastos.gestoria, note: 'Gestión trámites' },
                    { label: 'Tasación', pct: 'fijo', value: gastos.tasacion, note: 'Si hay hipoteca' },
                  ].map((g, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors">
                      <div>
                        <p className="font-inter font-medium text-navy text-xs">{g.label}</p>
                        <p className="text-slate-400 text-[10px] font-inter">{g.note} · {g.pct}</p>
                      </div>
                      <p className="font-inter font-bold text-navy text-sm tabular-nums shrink-0 ml-4">
                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(g.value)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="bg-navy px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-[10px] font-inter uppercase tracking-wider mb-0.5">Total gastos estimados</p>
                    <p className="text-white/60 text-[11px] font-inter">
                      {((gastos.total / p.precio) * 100).toFixed(1)}% sobre el precio de compra
                    </p>
                  </div>
                  <p className="font-inter font-black text-gold text-2xl tabular-nums">
                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(gastos.total)}
                  </p>
                </div>
                <p className="text-slate-400 text-[10px] font-inter text-center px-5 py-3">
                  Estimación para 2ª mano en Cataluña. Los importes pueden variar según el notario y el registro.
                </p>
              </div>
            </div>

            {/* Map location */}
            <div>
              <h2 className="font-inter font-bold text-navy text-base mb-3">Ubicación</h2>
              <p className="text-sm font-inter text-slate-500 mb-3 flex items-center gap-1.5">
                <MapPin size={13} className="text-gold" />{p.direccion}, {p.barrio}
              </p>
              <div className="rounded-2xl overflow-hidden border border-slate-100 h-[240px]">
                <MapContainer
                  center={[p.lat, p.lng]}
                  zoom={15}
                  style={{ width: '100%', height: '100%' }}
                  zoomControl={false}
                  dragging={false}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution=""
                  />
                  <Marker position={[p.lat, p.lng]} icon={dotMarker} />
                </MapContainer>
              </div>
            </div>
          </div>

          {/* RIGHT — Sidebar */}
          <div className="space-y-4">

            {/* Price card */}
            <div className="sticky top-[80px] space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="font-inter font-black text-navy text-3xl tabular-nums leading-none">{fmt(p.precio)}</p>
                    <p className="text-slate-400 text-sm font-inter mt-1 tabular-nums">{fmt(pm2)}/m²</p>
                  </div>
                  <span className={`text-sm font-bold px-2.5 py-1 rounded-lg text-white ${ENERGY_COLOR[p.energia]}`}>
                    {p.energia}
                  </span>
                </div>

                <div className="border-t border-slate-100 my-4" />

                {/* Agent */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center shrink-0">
                    <span className="font-inter font-black text-white text-sm">JO</span>
                  </div>
                  <div>
                    <p className="font-inter font-semibold text-navy text-sm">Joaquín de Oses</p>
                    <p className="text-slate-400 text-xs font-inter">Consultor · qimmo</p>
                  </div>
                </div>

                {/* Quick contact */}
                <div className="space-y-2">
                  <a href="tel:+34609019160"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-navy text-white rounded-xl font-inter font-semibold text-sm hover:bg-navy-light transition-all">
                    <Phone size={15} /> 609 019 160
                  </a>
                  <a href={`mailto:joaquin.deoses@qimmo.es?subject=Consulta sobre ${p.ref}`}
                    className="flex items-center justify-center gap-2 w-full py-3 border-2 border-navy text-navy rounded-xl font-inter font-semibold text-sm hover:bg-navy hover:text-white transition-all">
                    <Mail size={15} /> Enviar email
                  </a>
                </div>

                {/* Ref */}
                <p className="text-center text-slate-300 text-[11px] font-inter mt-3">Ref. {p.ref}</p>
              </div>

              {/* ── CONTACTO DIRECTO ──────────────────────────────── */}
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
        </div>
      </section>

      {/* ── SIMILAR PROPERTIES ─────────────────────────────────────── */}
      {similar.length > 0 && (
        <section className="border-t border-slate-100 py-12 bg-slate-50">
          <div className="max-w-screen-xl mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-inter font-bold text-navy text-lg">Propiedades similares</h2>
              <Link to="/buscar" className="text-sm font-inter text-slate-500 hover:text-navy transition-colors flex items-center gap-1">
                Ver todas <ArrowRight size={13} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {similar.map(s => (
                <Link
                  key={s.id}
                  to={`/buscar/${s.ref}`}
                  className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-md transition-all group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={s.imagen} alt={s.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute bottom-2 right-2 bg-white/95 px-2 py-1 rounded-lg">
                      <span className="font-inter font-bold text-navy text-sm tabular-nums">{fmt(s.precio)}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-inter font-semibold text-navy text-sm line-clamp-2 mb-1">{s.titulo}</p>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-inter">
                      <MapPin size={10} className="text-gold shrink-0" />{s.barrio}
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs font-inter text-slate-500">
                      <span>{s.m2}m²</span>
                      {s.habitaciones && <span>{s.habitaciones} hab.</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
