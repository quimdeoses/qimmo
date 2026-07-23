import { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MapPin, Maximize2, BedDouble, Bath, SlidersHorizontal, X, Search,
  List, Map, ChevronDown, Heart, ArrowUpDown, Car, TreePine, Loader2
} from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase, type Propiedad } from '../lib/supabase'

type TipoProp = Propiedad['tipo']
type ZonaProp = Propiedad['zona']

// ── Custom map markers ──────────────────────────────────────────────────────
function createPriceMarker(precio: number, active = false) {
  const t = precio >= 1000000
    ? `${(precio / 1000000).toFixed(precio % 1000000 === 0 ? 0 : 1)}M€`
    : `${Math.round(precio / 1000)}k€`
  return L.divIcon({
    className: '',
    html: `<div class="price-marker ${active ? 'active' : ''}" style="position:relative">${t}</div>`,
    iconSize: [72, 30],
    iconAnchor: [36, 30],
    popupAnchor: [0, -32],
  })
}

// ── Constants ───────────────────────────────────────────────────────────────
const TIPOS: (TipoProp | 'Todos')[] = ['Todos', 'Piso', 'Àtic', 'Duplex', 'Casa', 'Local', 'Oficina', 'Nave']
const ZONAS: (ZonaProp | 'Todos')[] = ['Todos', 'Barcelona', 'Zona Alta', 'Área Metropolitana', 'Costa Daurada', 'Vallès']

const PRECIO_RANGES = [
  { label: 'Sin límite', min: 0, max: Infinity },
  { label: 'Hasta 200.000€', min: 0, max: 200000 },
  { label: '200k – 400k€', min: 200000, max: 400000 },
  { label: '400k – 700k€', min: 400000, max: 700000 },
  { label: '700k – 1.200k€', min: 700000, max: 1200000 },
  { label: 'Más de 1.200k€', min: 1200000, max: Infinity },
]

const SORT_OPTIONS = [
  { label: 'Más recientes', val: 'recientes' },
  { label: 'Precio: menor a mayor', val: 'precio-asc' },
  { label: 'Precio: mayor a menor', val: 'precio-desc' },
  { label: 'Tamaño: mayor a menor', val: 'size-desc' },
]

const BADGE_STYLE: Record<string, string> = {
  'Nueva incorporación': 'bg-navy text-white',
  'Off-market':          'bg-slate-900 text-[#C8A96E]',
  'Inversión':           'bg-[#C8A96E] text-navy',
  'Precio reducido':     'bg-red-500 text-white',
}

const ENERGY_COLOR: Record<string, string> = {
  A: 'bg-green-500', B: 'bg-lime-500', C: 'bg-yellow-400 text-slate-900',
  D: 'bg-orange-400', E: 'bg-orange-500', F: 'bg-red-500', G: 'bg-red-700',
}

function fmt(n: number) {
  return new Intl.NumberFormat('es-ES').format(n) + '€'
}
function fmtShort(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M€`
  return `${Math.round(n / 1000)}k€`
}

// ── Property Card (list mode) ───────────────────────────────────────────────
function PropCard({ p, active, onHover }: { p: Propiedad; active: boolean; onHover: (id: number | null) => void }) {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const pm2 = Math.round(p.precio / p.m2)

  return (
    <div
      className={`prop-card group ${active ? 'prop-card-active' : ''}`}
      onClick={() => navigate(`/buscar/${p.ref}`)}
      onMouseEnter={() => onHover(p.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Image */}
      <div className="relative w-[200px] shrink-0 overflow-hidden">
        <img
          src={p.imagen}
          alt={p.titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          style={{ height: '100%', minHeight: '160px' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {p.badge && (
            <span className={`text-[10px] font-inter font-semibold px-2 py-0.5 rounded-md ${BADGE_STYLE[p.badge]}`}>
              {p.badge}
            </span>
          )}
        </div>
        {/* Fav */}
        <button
          onClick={e => { e.stopPropagation(); setSaved(s => !s) }}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
            saved ? 'bg-red-500 text-white' : 'bg-white/90 text-slate-400 hover:text-red-500'
          }`}
        >
          <Heart size={13} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 min-w-0 p-4 gap-3">
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          {/* Type + zone */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-inter font-semibold uppercase tracking-wider text-slate-400">{p.tipo}</span>
            <span className="text-slate-200">·</span>
            <span className="text-[10px] font-inter text-slate-400 truncate">{p.barrio}</span>
          </div>
          {/* Title */}
          <h3 className="font-inter font-semibold text-navy text-sm leading-snug line-clamp-2 group-hover:text-navy-light transition-colors">
            {p.titulo}
          </h3>
          {/* Address */}
          <div className="flex items-center gap-1 text-slate-400">
            <MapPin size={10} className="text-gold shrink-0" />
            <span className="text-[11px] font-inter truncate">{p.direccion}</span>
          </div>
          {/* Specs */}
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center gap-1 text-slate-500 text-xs font-inter">
              <Maximize2 size={11} /><span>{p.m2} m²</span>
            </div>
            {p.habitaciones !== undefined && (
              <div className="flex items-center gap-1 text-slate-500 text-xs font-inter">
                <BedDouble size={11} /><span>{p.habitaciones}</span>
              </div>
            )}
            {p.banos !== undefined && (
              <div className="flex items-center gap-1 text-slate-500 text-xs font-inter">
                <Bath size={11} /><span>{p.banos}</span>
              </div>
            )}
            {p.garage && (
              <div className="flex items-center gap-1 text-slate-500 text-xs font-inter">
                <Car size={11} /><span>Garaje</span>
              </div>
            )}
            {p.terraza && (
              <div className="flex items-center gap-1 text-slate-500 text-xs font-inter">
                <TreePine size={11} /><span>Terraza</span>
              </div>
            )}
          </div>
          {/* Energy */}
          {p.planta && (
            <span className="text-[10px] text-slate-400 font-inter">{p.planta} planta</span>
          )}
        </div>

        {/* Price panel */}
        <div className="flex flex-col items-end justify-between shrink-0 pl-3 border-l border-slate-100">
          <div className="text-right">
            <p className="font-inter font-bold text-navy text-lg leading-tight tabular-nums">{fmt(p.precio)}</p>
            <p className="text-[11px] text-slate-400 font-inter tabular-nums">{fmt(pm2)}/m²</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${ENERGY_COLOR[p.energia] || 'bg-slate-300'}`}>
              {p.energia}
            </span>
            <span className="text-[10px] font-inter text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded">
              {p.ref}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── MapPopup ─────────────────────────────────────────────────────────────────
function MapPopupContent({ p }: { p: Propiedad }) {
  const navigate = useNavigate()
  return (
    <div className="w-56 font-inter cursor-pointer" onClick={() => navigate(`/buscar/${p.ref}`)}>
      <img src={p.imagen} alt={p.titulo} className="w-full h-28 object-cover" />
      <div className="p-3">
        <p className="font-semibold text-navy text-xs leading-snug line-clamp-2 mb-1">{p.titulo}</p>
        <div className="flex items-center gap-1 text-slate-400 mb-2">
          <MapPin size={9} className="text-gold shrink-0" />
          <span className="text-[10px] truncate">{p.barrio}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-navy text-sm tabular-nums">{fmt(p.precio)}</span>
          <span className="text-[10px] text-slate-400">{p.m2}m²</span>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function Propiedades() {
  const [allProps, setAllProps]   = useState<Propiedad[]>([])
  const [loadingProps, setLoadingProps] = useState(true)
  const [search, setSearch]       = useState('')
  const [zona, setZona]           = useState<string>('Todos')
  const [tipo, setTipo]           = useState<string>('Todos')
  const [precioIdx, setPrecioIdx] = useState(0)
  const [minHab, setMinHab]       = useState(0)
  const [sortBy, setSortBy]       = useState('recientes')
  const [mobileView, setMobileView] = useState<'lista' | 'mapa'>('lista')
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    supabase.from('propiedades').select('*').eq('publicado', true).order('created_at', { ascending: false })
      .then(({ data }) => { setAllProps((data ?? []) as Propiedad[]); setLoadingProps(false) })
  }, [])

  const filtered = useMemo(() => {
    const range = PRECIO_RANGES[precioIdx]
    let list = allProps.filter(p => {
      const okSearch = search === '' ||
        p.titulo.toLowerCase().includes(search.toLowerCase()) ||
        p.barrio.toLowerCase().includes(search.toLowerCase()) ||
        p.direccion.toLowerCase().includes(search.toLowerCase()) ||
        p.ref.toLowerCase().includes(search.toLowerCase())
      const okZona   = zona === 'Todos' || p.zona === zona
      const okTipo   = tipo === 'Todos' || p.tipo === tipo
      const okPrecio = p.precio >= range.min && p.precio <= range.max
      const okHab    = minHab === 0 || (p.habitaciones != null && p.habitaciones >= minHab)
      return okSearch && okZona && okTipo && okPrecio && okHab
    })
    switch (sortBy) {
      case 'precio-asc':  list = [...list].sort((a, b) => a.precio - b.precio); break
      case 'precio-desc': list = [...list].sort((a, b) => b.precio - a.precio); break
      case 'size-desc':   list = [...list].sort((a, b) => b.m2 - a.m2); break
      default: break
    }
    return list
  }, [search, zona, tipo, precioIdx, minHab, sortBy])

  const hasFilters = zona !== 'Todos' || tipo !== 'Todos' || precioIdx !== 0 || minHab !== 0 || search !== ''

  const clearFilters = () => {
    setSearch(''); setZona('Todos'); setTipo('Todos'); setPrecioIdx(0); setMinHab(0)
  }

  const mapCenter: [number, number] = [41.395, 2.17]

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* ── TOP SEARCH BAR ─────────────────────────────────────────── */}
      <div className="fixed top-[60px] inset-x-0 z-40 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 lg:px-8">
          {/* Search row */}
          <div className="flex items-center gap-3 py-3">
            {/* Main search */}
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Barrio, ciudad, referencia…"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-inter text-slate-800 placeholder-slate-400 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition-all"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Zona */}
            <div className="relative hidden md:block">
              <select
                value={zona}
                onChange={e => setZona(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-inter text-slate-700 focus:outline-none focus:border-navy cursor-pointer"
              >
                {ZONAS.map(z => <option key={z} value={z}>{z === 'Todos' ? 'Zona: Todas' : z}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Tipo */}
            <div className="relative hidden md:block">
              <select
                value={tipo}
                onChange={e => setTipo(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-inter text-slate-700 focus:outline-none focus:border-navy cursor-pointer"
              >
                {TIPOS.map(t => <option key={t} value={t}>{t === 'Todos' ? 'Tipo: Todos' : t}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Precio */}
            <div className="relative hidden lg:block">
              <select
                value={precioIdx}
                onChange={e => setPrecioIdx(Number(e.target.value))}
                className="appearance-none pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-inter text-slate-700 focus:outline-none focus:border-navy cursor-pointer"
              >
                {PRECIO_RANGES.map((r, i) => <option key={i} value={i}>{r.label}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Habitaciones */}
            <div className="relative hidden lg:block">
              <select
                value={minHab}
                onChange={e => setMinHab(Number(e.target.value))}
                className="appearance-none pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-inter text-slate-700 focus:outline-none focus:border-navy cursor-pointer"
              >
                <option value={0}>Habitaciones</option>
                <option value={1}>1+ hab.</option>
                <option value={2}>2+ hab.</option>
                <option value={3}>3+ hab.</option>
                <option value={4}>4+ hab.</option>
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* More filters (mobile) */}
            <button
              onClick={() => setShowFilters(s => !s)}
              className={`md:hidden flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-inter font-medium border transition-all ${
                hasFilters ? 'bg-navy text-white border-navy' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              <SlidersHorizontal size={14} />
              {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />}
            </button>

            {hasFilters && (
              <button onClick={clearFilters} className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 hover:text-navy transition-colors font-inter">
                <X size={13} /> Limpiar
              </button>
            )}

            {/* View toggle */}
            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden ml-auto shrink-0">
              <button
                onClick={() => setMobileView('lista')}
                className={`px-3 py-2.5 flex items-center gap-1.5 text-xs font-inter font-medium transition-all ${
                  mobileView === 'lista' ? 'bg-navy text-white' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <List size={13} /> <span className="hidden sm:inline">Lista</span>
              </button>
              <button
                onClick={() => setMobileView('mapa')}
                className={`px-3 py-2.5 flex items-center gap-1.5 text-xs font-inter font-medium transition-all ${
                  mobileView === 'mapa' ? 'bg-navy text-white' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Map size={13} /> <span className="hidden sm:inline">Mapa</span>
              </button>
            </div>
          </div>

          {/* Mobile filters dropdown */}
          {showFilters && (
            <div className="md:hidden pb-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
              <select value={zona} onChange={e => setZona(e.target.value)}
                className="flex-1 min-w-[140px] appearance-none px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-inter text-slate-700 focus:outline-none focus:border-navy">
                {ZONAS.map(z => <option key={z} value={z}>{z === 'Todos' ? 'Zona: Todas' : z}</option>)}
              </select>
              <select value={tipo} onChange={e => setTipo(e.target.value)}
                className="flex-1 min-w-[120px] appearance-none px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-inter text-slate-700 focus:outline-none focus:border-navy">
                {TIPOS.map(t => <option key={t} value={t}>{t === 'Todos' ? 'Tipo: Todos' : t}</option>)}
              </select>
              <select value={precioIdx} onChange={e => setPrecioIdx(Number(e.target.value))}
                className="flex-1 min-w-[140px] appearance-none px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-inter text-slate-700 focus:outline-none focus:border-navy">
                {PRECIO_RANGES.map((r, i) => <option key={i} value={i}>{r.label}</option>)}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* ── MAIN SPLIT LAYOUT ──────────────────────────────────────── */}
      <div className="flex flex-1" style={{ marginTop: showFilters ? '125px' : '110px' }}>

        {/* LEFT — List panel */}
        <div className={`flex flex-col w-full lg:w-[520px] xl:w-[560px] shrink-0 ${
          mobileView === 'mapa' ? 'hidden lg:flex' : 'flex'
        }`}>
          {/* List header */}
          <div className="sticky top-[110px] z-30 bg-white border-b border-slate-100 px-4 lg:px-5 py-2.5 flex items-center justify-between">
            <p className="font-inter text-sm font-semibold text-navy">
              {filtered.length} <span className="font-normal text-slate-400">propiedades</span>
            </p>
            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(s => !s)}
                className="flex items-center gap-1.5 text-xs font-inter font-medium text-slate-500 hover:text-navy transition-colors"
              >
                <ArrowUpDown size={12} />
                {SORT_OPTIONS.find(s => s.val === sortBy)?.label}
                <ChevronDown size={11} />
              </button>
              {showSortMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50 min-w-[200px]">
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => { setSortBy(opt.val); setShowSortMenu(false) }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-inter transition-colors ${
                        sortBy === opt.val ? 'bg-navy/5 text-navy font-semibold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Property list */}
          <div className="flex-1 overflow-y-auto px-4 lg:px-5 py-4 space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-inter font-semibold text-navy text-lg mb-2">Sin resultados</p>
                <p className="text-slate-400 text-sm font-inter mb-5">Prueba con otros filtros o contacta con nosotros.</p>
                <button onClick={clearFilters} className="btn-primary">Quitar filtros</button>
              </div>
            ) : (
              filtered.map(p => (
                <PropCard
                  key={p.id}
                  p={p}
                  active={hoveredId === p.id}
                  onHover={setHoveredId}
                />
              ))
            )}
          </div>
        </div>

        {/* RIGHT — Map panel */}
        <div className={`flex-1 sticky top-[110px] h-[calc(100vh-110px)] ${
          mobileView === 'lista' ? 'hidden lg:block' : 'block'
        }`}>
          <MapContainer
            center={mapCenter}
            zoom={12}
            style={{ width: '100%', height: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {filtered.map(p => (
              <Marker
                key={p.id}
                position={[p.lat, p.lng]}
                icon={createPriceMarker(p.precio, hoveredId === p.id)}
                eventHandlers={{
                  mouseover: () => setHoveredId(p.id),
                  mouseout: () => setHoveredId(null),
                }}
              >
                <Popup>
                  <MapPopupContent p={p} />
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <Footer />
    </div>
  )
}
