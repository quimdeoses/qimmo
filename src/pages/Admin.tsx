import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import {
  supabase, supabaseReady, type Propiedad, type TipoProp, type ZonaProp,
  type EnergiaCert, type BadgeProp,
} from '../lib/supabase'
import {
  Plus, Pencil, Trash2, Eye, EyeOff, X, CheckCircle,
  LogOut, ImagePlus, Loader2, ChevronRight, Users, Home, Calendar,
  ArrowLeft, MapPin,
  FileText, BookOpen, Receipt, LayoutDashboard, Search, Wallet, MoreHorizontal,
} from 'lucide-react'
import SectionFacturas from './admin/Facturas'
import SectionInicio from './admin/Inicio'
import SectionFinanzas from './admin/Finanzas'
import SectionPipeline, { LeadRow, LeadSheet } from './admin/Pipeline'
import SectionVisitas from './admin/Visitas'
import { type Lead } from './admin/crm'
import { ToastStack, CommandPalette, type ToastItem, type CommandItem } from './admin/arc/overlays'
import { spring, sectionEnter } from './admin/arc/motion'
import { Logo, SegmentedControl } from './admin/arc/components'
import './admin/arc/arc.css'

type Section = 'inicio' | 'pipeline' | 'propiedades' | 'prop_detail' | 'visitas'
  | 'facturas' | 'gastos' | 'resultado' | 'mandato' | 'blog'

// Cada sección tiene su URL bajo /admin (enlaces directos y botón «atrás»)
const PATHS: Record<Exclude<Section, 'prop_detail'>, string> = {
  inicio: '', pipeline: 'leads', propiedades: 'properties', visitas: 'visits',
  facturas: 'billing/invoices', gastos: 'billing/expenses', resultado: 'billing/pnl',
  mandato: 'mandate', blog: 'blog',
}
const BILLING: Section[] = ['facturas', 'gastos', 'resultado']

function parsePath(pathname: string): { section: Section; propRef: string } {
  const [first = '', second = ''] = pathname.replace(/^\/admin\/?/, '').split('/')
  switch (first) {
    case 'leads':      return { section: 'pipeline', propRef: '' }
    case 'visits':     return { section: 'visitas', propRef: '' }
    case 'mandate':    return { section: 'mandato', propRef: '' }
    case 'blog':       return { section: 'blog', propRef: '' }
    case 'billing':    return { section: second === 'expenses' ? 'gastos' : second === 'pnl' ? 'resultado' : 'facturas', propRef: '' }
    case 'properties': return second ? { section: 'prop_detail', propRef: decodeURIComponent(second) } : { section: 'propiedades', propRef: '' }
    default:           return { section: 'inicio', propRef: '' }
  }
}

// ── Config ────────────────────────────────────────────────────────────────────
const TIPOS:    TipoProp[]    = ['Piso', 'Àtic', 'Duplex', 'Casa', 'Local', 'Oficina', 'Nave']
const ZONAS:    ZonaProp[]    = ['Barcelona', 'Zona Alta', 'Área Metropolitana', 'Costa Daurada', 'Vallès']
const ENERGIAS: EnergiaCert[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
const BADGES:   (BadgeProp | '')[] = ['', 'Nueva incorporación', 'Off-market', 'Inversión', 'Precio reducido']

const EMPTY_FORM = {
  ref: '', titulo: '', tipo: 'Piso' as TipoProp, zona: 'Barcelona' as ZonaProp,
  barrio: '', direccion: '', precio: '', m2: '', habitaciones: '', banos: '',
  planta: '', terraza: false, garage: false, ascensor: false, piscina: false,
  badge: '' as BadgeProp | '', descripcion: '', caracteristicas: '', energia: 'D' as EnergiaCert,
  lat: '41.3874', lng: '2.1686', publicado: false,
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n: number) { return n.toLocaleString('es-ES', { useGrouping: 'always' }) + ' €' }

// ── Login ─────────────────────────────────────────────────────────────────────
function Login() {
  const [email, setEmail]     = useState('')
  const [pwd, setPwd]         = useState('')
  const [err, setErr]         = useState('')
  const [loading, setLoading] = useState(false)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password: pwd })
    setLoading(false)
    if (error) { setErr('Email o contraseña incorrectos'); setPwd('') }
  }
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D1F3C' }}>
      <div className="bg-white rounded-2xl p-10 w-full max-w-sm shadow-2xl">
        <div className="flex justify-center mb-8"><Logo width={130} /></div>
        <h1 className="font-jakarta font-bold text-navy text-xl text-center mb-6">Admin · qimmo</h1>
        <form onSubmit={submit} className="space-y-4">
          <input type="email" placeholder="Email" value={email} autoFocus autoComplete="username"
            onChange={e => { setEmail(e.target.value); setErr('') }} className="input w-full" />
          <input type="password" placeholder="Contraseña" value={pwd} autoComplete="current-password"
            onChange={e => { setPwd(e.target.value); setErr('') }} className="input w-full" />
          {err && <p className="font-inter text-xs text-red-500">{err}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? <Loader2 size={15} className="animate-spin" /> : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Photo uploader ────────────────────────────────────────────────────────────
function PhotoUploader({ propRef, current, onChange }: {
  propRef: string; current: string[]; onChange: (urls: string[]) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  const upload = async (files: FileList) => {
    setLoading(true)
    const newUrls: string[] = []
    for (const file of Array.from(files)) {
      const ext  = file.name.split('.').pop()
      const name = `${propRef}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('propiedades').upload(name, file, { upsert: true })
      if (!error) {
        const { data } = supabase.storage.from('propiedades').getPublicUrl(name)
        newUrls.push(data.publicUrl)
      }
    }
    setLoading(false)
    onChange([...current, ...newUrls])
  }

  const remove = async (url: string) => {
    const path = url.split('/propiedades/')[1]
    if (path) await supabase.storage.from('propiedades').remove([path])
    onChange(current.filter(u => u !== url))
  }

  return (
    <div>
      <label className="block font-inter text-xs font-semibold text-navy mb-2">Fotos ({current.length})</label>
      <div className="flex flex-wrap gap-2">
        {current.map((url, i) => (
          <div key={url} className="relative group w-20 h-20">
            <img src={url} alt="" className="w-20 h-20 object-cover rounded-lg" />
            {i === 0 && (
              <span className="absolute bottom-0.5 left-0.5 bg-black/60 text-white text-[8px] px-1 rounded font-inter">portada</span>
            )}
            <button type="button" onClick={() => remove(url)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <X size={10} />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => inputRef.current?.click()}
          disabled={loading || !propRef}
          className="w-20 h-20 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1"
          style={{ borderColor: '#E2E0DA', color: '#9CA3AF' }}
          title={!propRef ? 'Introduce la referencia antes de subir fotos' : 'Subir fotos'}>
          {loading ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
          {!loading && <span className="text-[9px] font-inter">Subir</span>}
        </button>
      </div>
      {!propRef && <p className="font-inter text-[10px] mt-1" style={{ color: '#F59E0B' }}>Introduce la referencia antes de subir fotos</p>}
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
        onChange={e => e.target.files && upload(e.target.files)} />
    </div>
  )
}

// ── Property form ─────────────────────────────────────────────────────────────
function PropForm({ initial, onSave, onCancel }: {
  initial: Propiedad | null; onSave: () => void; onCancel: () => void
}) {
  const editing = !!initial
  const [form, setForm] = useState(() =>
    initial ? {
      ref: initial.ref, titulo: initial.titulo, tipo: initial.tipo, zona: initial.zona,
      barrio: initial.barrio, direccion: initial.direccion,
      precio: String(initial.precio), m2: String(initial.m2),
      habitaciones: initial.habitaciones != null ? String(initial.habitaciones) : '',
      banos: initial.banos != null ? String(initial.banos) : '',
      planta: initial.planta ?? '', terraza: initial.terraza, garage: initial.garage,
      ascensor: initial.ascensor, piscina: initial.piscina,
      badge: (initial.badge ?? '') as BadgeProp | '',
      descripcion: initial.descripcion,
      caracteristicas: initial.caracteristicas.join('\n'),
      energia: initial.energia, lat: String(initial.lat), lng: String(initial.lng),
      publicado: initial.publicado,
    } : { ...EMPTY_FORM }
  )
  const [photos, setPhotos] = useState<string[]>(initial?.imagenes ?? [])
  const [saving, setSaving] = useState(false)
  const [err, setErr]       = useState('')

  const set = (k: keyof typeof EMPTY_FORM) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))
  const toggle = (k: 'terraza' | 'garage' | 'ascensor' | 'piscina' | 'publicado') =>
    setForm(f => ({ ...f, [k]: !f[k] }))

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    if (!form.ref || !form.titulo || !form.precio || !form.m2) {
      setErr('Ref, título, precio y m² son obligatorios'); return
    }
    setSaving(true)
    const payload = {
      ref: form.ref.trim(), titulo: form.titulo.trim(), tipo: form.tipo, zona: form.zona,
      barrio: form.barrio.trim(), direccion: form.direccion.trim(),
      precio: Number(form.precio), m2: Number(form.m2),
      habitaciones: form.habitaciones ? Number(form.habitaciones) : null,
      banos: form.banos ? Number(form.banos) : null,
      planta: form.planta || null, terraza: form.terraza, garage: form.garage,
      ascensor: form.ascensor, piscina: form.piscina,
      imagen: photos[0] ?? '', imagenes: photos,
      badge: (form.badge || null) as BadgeProp | null,
      descripcion: form.descripcion.trim(),
      caracteristicas: form.caracteristicas.split('\n').map(s => s.trim()).filter(Boolean),
      energia: form.energia,
      lat: Number(form.lat) || 41.3874, lng: Number(form.lng) || 2.1686,
      publicado: form.publicado,
    }
    const { error } = editing && initial
      ? await supabase.from('propiedades').update(payload).eq('id', initial.id)
      : await supabase.from('propiedades').insert(payload)
    setSaving(false)
    if (error) { setErr(error.message); return }
    onSave()
  }

  const F = (label: string, node: React.ReactNode) => (
    <div>
      <label className="block font-inter text-xs font-semibold text-navy mb-1.5">{label}</label>
      {node}
    </div>
  )

  return (
    <form onSubmit={save} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        {F('Referencia *', <input className="input w-full" placeholder="QIM-001" value={form.ref} onChange={set('ref')} disabled={editing} />)}
        {F('Título *', <input className="input w-full" placeholder="Piso en Eixample" value={form.titulo} onChange={set('titulo')} />)}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {F('Tipo', <select className="input w-full" value={form.tipo} onChange={set('tipo')}>{TIPOS.map(t => <option key={t}>{t}</option>)}</select>)}
        {F('Zona', <select className="input w-full" value={form.zona} onChange={set('zona')}>{ZONAS.map(z => <option key={z}>{z}</option>)}</select>)}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {F('Barrio', <input className="input w-full" placeholder="Eixample Dreta" value={form.barrio} onChange={set('barrio')} />)}
        {F('Dirección', <input className="input w-full" placeholder="C/ Balmes 50, 3º 1ª" value={form.direccion} onChange={set('direccion')} />)}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {F('Precio € *', <input className="input w-full" type="number" placeholder="350000" value={form.precio} onChange={set('precio')} />)}
        {F('m² *', <input className="input w-full" type="number" placeholder="85" value={form.m2} onChange={set('m2')} />)}
        {F('Cert. energético', <select className="input w-full" value={form.energia} onChange={set('energia')}>{ENERGIAS.map(e => <option key={e}>{e}</option>)}</select>)}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {F('Habitaciones', <input className="input w-full" type="number" placeholder="3" value={form.habitaciones} onChange={set('habitaciones')} />)}
        {F('Baños', <input className="input w-full" type="number" placeholder="2" value={form.banos} onChange={set('banos')} />)}
        {F('Planta', <input className="input w-full" placeholder="3ª" value={form.planta} onChange={set('planta')} />)}
      </div>
      <div className="flex flex-wrap gap-5">
        {(['terraza', 'garage', 'ascensor', 'piscina'] as const).map(k => (
          <label key={k} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form[k]} onChange={() => toggle(k)} className="w-4 h-4" style={{ accentColor: '#0D1F3C' }} />
            <span className="font-inter text-sm capitalize" style={{ color: '#4B5563' }}>{k}</span>
          </label>
        ))}
      </div>
      {F('Badge', <select className="input w-full" value={form.badge} onChange={set('badge')}>{BADGES.map(b => <option key={b} value={b}>{b || '— Sin badge —'}</option>)}</select>)}
      {F('Descripción', <textarea className="input w-full resize-none" rows={5} placeholder="Descripción del inmueble…" value={form.descripcion} onChange={set('descripcion')} />)}
      {F('Características (una por línea)', <textarea className="input w-full resize-none font-mono text-xs" rows={5} placeholder={'Suelos de parquet\nCocina equipada\nPuertas de roble'} value={form.caracteristicas} onChange={set('caracteristicas')} />)}
      <div className="grid grid-cols-2 gap-4">
        {F('Latitud', <input className="input w-full" placeholder="41.3874" value={form.lat} onChange={set('lat')} />)}
        {F('Longitud', <input className="input w-full" placeholder="2.1686" value={form.lng} onChange={set('lng')} />)}
      </div>
      <PhotoUploader propRef={form.ref} current={photos} onChange={setPhotos} />
      <div className="flex items-center gap-3 pt-2" style={{ borderTop: '1px solid #E2E0DA' }}>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.publicado} onChange={() => toggle('publicado')} className="w-4 h-4" style={{ accentColor: '#0D1F3C' }} />
          <span className="font-inter text-sm font-semibold" style={{ color: form.publicado ? '#0D1F3C' : '#9CA3AF' }}>
            {form.publicado ? 'Publicada — visible en la web' : 'Borrador — no visible en la web'}
          </span>
        </label>
      </div>
      {err && <p className="font-inter text-xs text-red-500">{err}</p>}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="btn-primary gap-2">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
          {saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear propiedad'}
        </button>
        <button type="button" onClick={onCancel} className="btn-outline">Cancelar</button>
      </div>
    </form>
  )
}

// ── SECTION: Propiedades list ─────────────────────────────────────────────────
function SectionPropiedades({
  notify, onSelectProp,
}: { notify: (m: string, ok?: boolean) => void; onSelectProp: (p: Propiedad) => void }) {
  const [props, setProps]   = useState<Propiedad[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]   = useState<'new' | null>(null)

  const load = async () => {
    if (!supabaseReady) { setLoading(false); return }
    setLoading(true)
    const { data, error } = await supabase.from('propiedades').select('*').order('created_at', { ascending: false })
    setLoading(false)
    if (error) { notify(error.message, false); return }
    setProps((data ?? []) as Propiedad[])
  }

  useEffect(() => { load() }, [])

  const togglePublicado = async (p: Propiedad) => {
    const { error } = await supabase.from('propiedades').update({ publicado: !p.publicado }).eq('id', p.id)
    if (error) { notify(error.message, false); return }
    setProps(ps => ps.map(x => x.id === p.id ? { ...x, publicado: !x.publicado } : x))
    notify(p.publicado ? 'Despublicada' : 'Publicada')
  }

  const [filter, setFilter] = useState<'todas' | 'publicadas' | 'borradores'>('todas')
  const [q, setQ] = useState('')
  const needle = q.trim().toLowerCase()
  const shown = props.filter(p =>
    (filter === 'todas' || (filter === 'publicadas') === p.publicado) &&
    (!needle || `${p.ref} ${p.titulo} ${p.barrio} ${p.direccion}`.toLowerCase().includes(needle)))

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="font-jakarta font-bold text-2xl">Propiedades</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {props.filter(p => p.publicado).length} publicadas · {props.filter(p => !p.publicado).length} borradores
          </p>
        </div>
        <button onClick={() => setModal('new')} className="btn-primary"><Plus size={16} /><span className="hidden sm:inline">Nueva propiedad</span></button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SegmentedControl id="prop-filter" value={filter} onChange={setFilter} options={[
          { value: 'todas', label: `Todas · ${props.length}` },
          { value: 'publicadas', label: 'Publicadas' },
          { value: 'borradores', label: 'Borradores' },
        ]} />
        <label className="flex items-center gap-2 px-3 h-10 rounded-[var(--radius-control)] sm:ml-auto sm:w-64"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <Search size={15} style={{ color: 'var(--text-muted)' }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Ref, título, barrio…"
            className="flex-1 min-w-0 bg-transparent outline-none text-sm" />
        </label>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin" style={{ color: 'var(--text-muted)' }} /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {shown.map(p => (
            <motion.div key={p.id} layout transition={spring.gentle} whileTap={{ scale: 0.99 }}
              className="arc-card overflow-hidden cursor-pointer group" onClick={() => onSelectProp(p)}>
              <div className="relative aspect-[16/10] overflow-hidden" style={{ background: 'var(--surface-muted)' }}>
                {p.imagen
                  ? <img src={p.imagen} alt={p.titulo} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                  : <div className="w-full h-full grid place-items-center"><Home size={30} style={{ color: 'var(--border-strong)' }} /></div>}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-start">
                  <span className="arc-pill" style={{ background: 'rgb(255 255 255 / .9)', color: 'var(--accent)', backdropFilter: 'blur(6px)' }}>{p.ref}</span>
                  <button onClick={e => { e.stopPropagation(); togglePublicado(p) }} className="arc-pill"
                    style={p.publicado
                      ? { background: 'color-mix(in oklch, var(--success) 90%, white)', color: 'white' }
                      : { background: 'rgb(0 0 0 / .55)', color: 'white', backdropFilter: 'blur(6px)' }}>
                    {p.publicado ? <Eye size={10} /> : <EyeOff size={10} />}{p.publicado ? 'Publicada' : 'Borrador'}
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>{p.barrio || p.zona} · {p.tipo}</p>
                <p className="font-jakarta font-semibold line-clamp-1">{p.titulo}</p>
                <div className="flex items-center justify-between mt-2.5">
                  <span className="font-jakarta font-bold tabular">{fmt(p.precio)}</span>
                  <span className="text-xs tabular" style={{ color: 'var(--text-muted)' }}>
                    {[p.m2 && `${p.m2} m²`, p.habitaciones && `${p.habitaciones} hab.`].filter(Boolean).join(' · ')}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* New property modal */}
      {modal === 'new' && (
        <div className="fixed inset-0 z-[120] flex items-start justify-center py-8 px-4 overflow-y-auto"
          style={{ background: 'color-mix(in oklch, #0D1F3C 35%, transparent)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-2xl my-auto rounded-[var(--radius-surface)]" style={{ background: 'var(--surface)', boxShadow: 'var(--shadow-floating)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #E2E0DA' }}>
              <h2 className="font-jakarta font-bold text-navy text-lg">Nueva propiedad</h2>
              <button onClick={() => setModal(null)} style={{ color: '#6B7280' }}><X size={18} /></button>
            </div>
            <div className="px-6 py-6 overflow-y-auto" style={{ maxHeight: '80vh' }}>
              <PropForm initial={null} onSave={() => { load(); setModal(null); notify('Propiedad creada') }} onCancel={() => setModal(null)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── SECTION: Propiedad detalle ────────────────────────────────────────────────
function SectionPropDetail({ prop, onBack, notify }: {
  prop: Propiedad; onBack: () => void; notify: (m: string, ok?: boolean) => void
}) {
  const [current, setCurrent] = useState<Propiedad>(prop)
  const [openLead, setOpenLead] = useState<number | null>(null)
  const eliminar = async () => {
    if (!confirm(`¿Eliminar "${current.titulo}"? Esta acción no se puede deshacer.`)) return
    const { error } = await supabase.from('propiedades').delete().eq('id', current.id)
    if (error) { notify(error.message, false); return }
    notify('Propiedad eliminada')
    onBack()
  }
  const [leads, setLeads]     = useState<Lead[]>([])
  const [editing, setEditing] = useState(false)
  const [tab, setTab]         = useState<'info' | 'leads'>('info')

  useEffect(() => {
    if (!supabaseReady) return
    supabase.from('leads').select('*').eq('propiedad_ref', prop.ref).order('created_at', { ascending: false })
      .then(({ data }) => setLeads((data ?? []) as Lead[]))
  }, [prop.ref])

  const updateLead = (id: number, changes: Partial<Lead>) =>
    setLeads(ls => ls.map(l => l.id === id ? { ...l, ...changes } : l))

  return (
    <div>
      {/* Back + header */}
      <div className="flex items-center gap-2 mb-5">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={15} /> Propiedades
        </button>
        <ChevronRight size={14} style={{ color: 'var(--border-strong)' }} />
        <span className="text-sm font-semibold" style={{ color: 'var(--gold)' }}>{current.ref}</span>
        <div className="flex-1" />
        <button onClick={eliminar} className="p-2 rounded-lg" title="Eliminar propiedad" style={{ color: 'var(--text-muted)' }}><Trash2 size={15} /></button>
      </div>

      {/* Hero */}
      <div className="arc-card overflow-hidden mb-5">
        <div className="relative h-56 sm:h-72 overflow-hidden">
          {current.imagen
            ? <img src={current.imagen} alt={current.titulo} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center" style={{ background: '#F0F4FA' }}><Home size={40} style={{ color: '#C4C0B8' }} /></div>}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,31,60,0.7) 0%, transparent 60%)' }} />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <p className="font-inter text-xs mb-1" style={{ color: 'rgba(255,255,255,0.65)' }}>{current.barrio} · {current.tipo}</p>
              <p className="font-jakarta font-bold text-white text-xl">{current.titulo}</p>
            </div>
            <span className="font-jakarta font-bold text-2xl" style={{ color: '#C49A3C' }}>{fmt(current.precio)}</span>
          </div>
        </div>
        <div className="px-5 py-3 flex flex-wrap gap-3 items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {current.m2 && <span>{current.m2} m²</span>}
            {current.habitaciones && <span>{current.habitaciones} hab.</span>}
            {current.banos && <span>{current.banos} baños</span>}
            <span className="font-semibold px-2 py-0.5 rounded-full text-[10px] uppercase"
              style={{ background: current.publicado ? '#ECFDF5' : '#F3F4F6', color: current.publicado ? '#059669' : '#9CA3AF' }}>
              {current.publicado ? 'Publicada' : 'Borrador'}
            </span>
          </div>
          <div className="flex gap-2">
            {current.publicado && (
              <a href={`/buscar/${current.ref}`} target="_blank"
                className="font-inter text-xs font-semibold px-3 py-1.5 rounded-lg"
                style={{ background: '#F0F4FA', color: '#0D1F3C' }}>
                Ver en web →
              </a>
            )}
            <button onClick={() => setEditing(true)} className="btn-primary gap-1.5" style={{ padding: '0.4rem 1rem', fontSize: 12 }}>
              <Pencil size={12} /> Editar
            </button>
          </div>
        </div>
      </div>

      {/* Photo strip */}
      {current.imagenes?.length > 0 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {current.imagenes.map((img, i) => (
            <img key={i} src={img} alt="" className="w-24 h-16 object-cover rounded-xl shrink-0" />
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-5">
        <SegmentedControl id="prop-tab" value={tab} onChange={setTab}
          options={[{ value: 'info', label: 'Información' }, { value: 'leads', label: `Leads · ${leads.length}` }]} />
      </div>

      {tab === 'info' && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: 'Dirección', val: current.direccion || '—' },
            { label: 'Zona', val: current.zona },
            { label: 'Precio/m²', val: current.m2 ? `${Math.round(current.precio / current.m2).toLocaleString('es-ES')} €/m²` : '—' },
            { label: 'Cert. energético', val: current.energia },
            { label: 'Planta', val: current.planta ?? '—' },
            { label: 'Referencia', val: current.ref },
          ].map(({ label, val }) => (
            <div key={label} className="arc-card !rounded-2xl p-4">
              <p className="font-inter text-[10px] uppercase tracking-widest mb-1" style={{ color: '#9CA3AF' }}>{label}</p>
              <p className="font-jakarta font-bold text-navy text-sm">{val}</p>
            </div>
          ))}
          {current.descripcion && (
            <div className="arc-card !rounded-2xl p-4 col-span-2 lg:col-span-3">
              <p className="font-inter text-[10px] uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>Descripción</p>
              <p className="font-inter text-sm leading-relaxed" style={{ color: '#4B5563' }}>{current.descripcion}</p>
            </div>
          )}
          {current.caracteristicas?.length > 0 && (
            <div className="arc-card !rounded-2xl p-4 col-span-2 lg:col-span-3">
              <p className="font-inter text-[10px] uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>Características</p>
              <ul className="space-y-1">
                {current.caracteristicas.map((c, i) => (
                  <li key={i} className="flex items-center gap-2 font-inter text-sm" style={{ color: '#4B5563' }}>
                    <span className="w-1 h-1 rounded-full shrink-0" style={{ background: '#C49A3C' }} />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {tab === 'leads' && (
        leads.length === 0
          ? <div className="text-center py-12"><p className="font-inter text-sm" style={{ color: '#9CA3AF' }}>Sin leads para esta propiedad</p></div>
          : <div className="arc-card p-2">{leads.map(l => <LeadRow key={l.id} lead={l} onOpen={() => setOpenLead(l.id)} />)}</div>
      )}
      <LeadSheet key={openLead ?? 'none'} lead={leads.find(l => l.id === openLead) ?? null}
        onClose={() => setOpenLead(null)} onUpdate={updateLead} notify={notify} />

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-[120] flex items-start justify-center py-8 px-4 overflow-y-auto"
          style={{ background: 'color-mix(in oklch, #0D1F3C 35%, transparent)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-2xl my-auto rounded-[var(--radius-surface)]" style={{ background: 'var(--surface)', boxShadow: 'var(--shadow-floating)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #E2E0DA' }}>
              <h2 className="font-jakarta font-bold text-navy text-lg">Editar — {current.ref}</h2>
              <button onClick={() => setEditing(false)} style={{ color: '#6B7280' }}><X size={18} /></button>
            </div>
            <div className="px-6 py-6 overflow-y-auto" style={{ maxHeight: '80vh' }}>
              <PropForm initial={current}
                onSave={async () => {
                  const { data } = await supabase.from('propiedades').select('*').eq('ref', current.ref).single()
                  if (data) setCurrent(data as Propiedad)
                  setEditing(false)
                  notify('Cambios guardados')
                }}
                onCancel={() => setEditing(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Sidebar nav item ──────────────────────────────────────────────────────────
function NavItem({ icon: Icon, label, active, badge, onClick, layoutGroup }: {
  icon: React.FC<{ size?: number; style?: React.CSSProperties }>
  label: string; active: boolean; badge?: number; onClick: () => void; layoutGroup: string
}) {
  return (
    <motion.button onClick={onClick} whileTap={{ scale: 0.98 }} transition={spring.snappy}
      className="relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left"
      style={{ color: active ? 'var(--foreground)' : 'var(--text-secondary)' }}>
      {active && (
        <motion.span layoutId={`nav-active-${layoutGroup}`} className="absolute inset-0 rounded-xl"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-resting)' }}
          transition={spring.snappy} />
      )}
      <Icon size={16} style={{ position: 'relative', color: active ? 'var(--accent)' : 'var(--text-muted)' }} />
      <span className="relative text-sm font-medium flex-1">{label}</span>
      {badge != null && badge > 0 && (
        <span className="relative arc-pill"
          style={{ background: 'color-mix(in oklch, var(--gold) 16%, transparent)', color: '#9A7424' }}>{badge}</span>
      )}
    </motion.button>
  )
}

// ── SECTION: Blog ─────────────────────────────────────────────────────────────
interface BlogPostAdmin {
  id: number
  slug: string
  titulo: string
  categoria: string
  extracto: string
  contenido: string
  fecha: string
  tiempo_lectura: string
  publicado: boolean
  created_at: string
}

const BLOG_CATS = ['Comprar', 'Vender', 'Alquilar', 'Inversión', 'Normativa']

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function SectionBlog({ notify }: { notify: (m: string, ok?: boolean) => void }) {
  const [posts, setPosts]     = useState<BlogPostAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState<BlogPostAdmin | null | 'new'>(null)

  const load = async () => {
    if (!supabaseReady) { setLoading(false); return }
    setLoading(true)
    const { data, error } = await supabase.from('blog_posts').select('*').order('fecha', { ascending: false })
    setLoading(false)
    if (error) { notify(error.message, false); return }
    setPosts((data ?? []) as BlogPostAdmin[])
  }

  useEffect(() => { load() }, [])

  const togglePublish = async (post: BlogPostAdmin) => {
    await supabase.from('blog_posts').update({ publicado: !post.publicado }).eq('id', post.id)
    setPosts(ps => ps.map(p => p.id === post.id ? { ...p, publicado: !p.publicado } : p))
    notify(post.publicado ? 'Despublicado' : 'Publicado')
  }

  const deletePost = async (id: number) => {
    if (!confirm('¿Eliminar este artículo?')) return
    await supabase.from('blog_posts').delete().eq('id', id)
    setPosts(ps => ps.filter(p => p.id !== id))
    notify('Artículo eliminado')
  }

  const CAT_DOT: Record<string, string> = {
    Comprar: '#1D4ED8', Vender: '#059669', Alquilar: '#7C3AED',
    Inversión: '#C49A3C', Normativa: '#DC2626',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-jakarta font-bold text-navy text-2xl">Blog</h1>
          <p className="font-inter text-sm mt-1" style={{ color: '#9CA3AF' }}>{posts.length} artículos</p>
        </div>
        <button onClick={() => setModal('new')} className="btn-primary gap-2">
          <Plus size={15} /> Nuevo artículo
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin" style={{ color: '#C49A3C' }} /></div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen size={40} className="mx-auto mb-3" style={{ color: '#E2E0DA' }} />
          <p className="font-jakarta font-bold text-navy mb-2">Sin artículos todavía</p>
          <p className="font-inter text-sm mb-4" style={{ color: '#9CA3AF' }}>Crea el primer artículo del blog</p>
          <button onClick={() => setModal('new')} className="btn-primary">Crear artículo</button>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl px-5 py-4 flex items-center gap-4"
              style={{ border: '1px solid #E2E0DA' }}>
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: CAT_DOT[post.categoria] ?? '#9CA3AF' }} />
              <div className="flex-1 min-w-0">
                <p className="font-jakarta font-bold text-navy text-sm truncate">{post.titulo}</p>
                <p className="font-inter text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                  {post.categoria} · {post.fecha} · {post.tiempo_lectura}
                </p>
              </div>
              <span className="font-inter text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
                style={{ background: post.publicado ? '#ECFDF5' : '#F3F4F6', color: post.publicado ? '#059669' : '#9CA3AF' }}>
                {post.publicado ? 'Publicado' : 'Borrador'}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => togglePublish(post)} className="p-1.5 rounded-lg hover:bg-gray-50"
                  title={post.publicado ? 'Despublicar' : 'Publicar'} style={{ color: '#6B7280' }}>
                  {post.publicado ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <button onClick={() => setModal(post)} className="p-1.5 rounded-lg hover:bg-gray-50" style={{ color: '#6B7280' }}>
                  <Pencil size={15} />
                </button>
                <button onClick={() => deletePost(post.id)} className="p-1.5 rounded-lg hover:bg-red-50" style={{ color: '#9CA3AF' }}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal !== null && (
        <BlogPostModal
          post={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load() }}
          notify={notify}
        />
      )}
    </div>
  )
}

function BlogPostModal({ post, onClose, onSaved, notify }: {
  post: BlogPostAdmin | null
  onClose: () => void
  onSaved: () => void
  notify: (m: string, ok?: boolean) => void
}) {
  const editing = !!post
  const [titulo, setTitulo]     = useState(post?.titulo ?? '')
  const [slug, setSlug]         = useState(post?.slug ?? '')
  const [categoria, setCategoria] = useState(post?.categoria ?? 'Comprar')
  const [extracto, setExtracto] = useState(post?.extracto ?? '')
  const [contenido, setContenido] = useState(post?.contenido ?? '')
  const [fecha, setFecha]       = useState(post?.fecha ?? new Date().toISOString().split('T')[0])
  const [tiempo, setTiempo]     = useState(post?.tiempo_lectura ?? '5 min')
  const [publicado, setPublicado] = useState(post?.publicado ?? false)
  const [saving, setSaving]     = useState(false)

  const autoSlug = (t: string) => {
    if (!editing) setSlug(slugify(t))
  }

  const save = async () => {
    if (!titulo || !slug || !extracto) { notify('Título, slug y extracto son obligatorios', false); return }
    setSaving(true)
    const payload = { titulo, slug, categoria, extracto, contenido, fecha, tiempo_lectura: tiempo, publicado }
    const { error } = editing && post
      ? await supabase.from('blog_posts').update(payload).eq('id', post.id)
      : await supabase.from('blog_posts').insert(payload)
    setSaving(false)
    if (error) { notify(error.message, false); return }
    notify(editing ? 'Artículo actualizado' : 'Artículo creado')
    onSaved()
  }

  const inp = "input w-full"
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
      style={{ background: 'rgba(13,31,60,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #E2E0DA' }}>
          <h2 className="font-jakarta font-bold text-navy text-lg">{editing ? 'Editar artículo' : 'Nuevo artículo'}</h2>
          <button onClick={onClose} style={{ color: '#9CA3AF' }}><X size={20} /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="label-field">Título *</label>
            <input className={inp} value={titulo} onChange={e => { setTitulo(e.target.value); autoSlug(e.target.value) }} placeholder="Título del artículo" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Slug *</label>
              <input className={inp} value={slug} onChange={e => setSlug(e.target.value)} placeholder="mi-articulo-slug" />
            </div>
            <div>
              <label className="label-field">Categoría</label>
              <select className={inp} value={categoria} onChange={e => setCategoria(e.target.value)}>
                {BLOG_CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label-field">Extracto (resumen) *</label>
            <textarea className={inp + ' resize-none'} rows={3} value={extracto}
              onChange={e => setExtracto(e.target.value)} placeholder="Breve descripción del artículo..." />
          </div>
          <div>
            <label className="label-field">Contenido (separa párrafos con línea en blanco)</label>
            <textarea className={inp + ' resize-none font-mono text-xs'} rows={12} value={contenido}
              onChange={e => setContenido(e.target.value)} placeholder={'Primer párrafo del artículo...\n\nSegundo párrafo...'} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Fecha</label>
              <input type="date" className={inp} value={fecha} onChange={e => setFecha(e.target.value)} />
            </div>
            <div>
              <label className="label-field">Tiempo de lectura</label>
              <input className={inp} value={tiempo} onChange={e => setTiempo(e.target.value)} placeholder="5 min" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={publicado} onChange={() => setPublicado(v => !v)}
              className="w-4 h-4" style={{ accentColor: '#0D1F3C' }} />
            <span className="font-inter text-sm font-semibold" style={{ color: publicado ? '#0D1F3C' : '#9CA3AF' }}>
              {publicado ? 'Publicado — visible en la web' : 'Borrador — no visible todavía'}
            </span>
          </label>
        </div>
        <div className="flex gap-3 px-6 py-4" style={{ borderTop: '1px solid #E2E0DA' }}>
          <button onClick={save} disabled={saving} className="btn-primary gap-2">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
            {saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear artículo'}
          </button>
          <button onClick={onClose} className="btn-outline">Cancelar</button>
        </div>
      </div>
    </div>
  )
}

// ── SECTION: Mandato ──────────────────────────────────────────────────────────
function SearchButton({ compact = false, onClick }: { compact?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-2 rounded-xl text-sm ${compact ? 'p-2' : 'w-full px-3 py-2'}`}
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
      <Search size={15} />
      {!compact && <><span className="flex-1 text-left">Buscar…</span><span className="arc-kbd">⌘K</span></>}
    </button>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed]       = useState<boolean | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { section, propRef } = parsePath(location.pathname)
  const [selectedProp, setSelectedProp] = useState<Propiedad | null>(null)
  const [toasts, setToasts]       = useState<ToastItem[]>([])
  const [newLeadsCount, setNewLeadsCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cmdOpen, setCmdOpen]     = useState(false)
  const [cmdData, setCmdData]     = useState<{
    leads: Lead[]; props: Propiedad[]; invoices: { number: string; client_name: string | null; total: number | null }[]
  } | null>(null)

  const notify = useCallback((msg: string, ok = true) =>
    setToasts(ts => [...ts, { id: Date.now() + Math.random(), msg, ok }]), [])
  const dismiss = useCallback((id: number) => setToasts(ts => ts.filter(t => t.id !== id)), [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setAuthed(!!session))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!authed || !supabaseReady) return
    supabase.from('leads').select('id', { count: 'exact' }).eq('estado', 'nuevo')
      .then(({ count }) => setNewLeadsCount(count ?? 0))
  }, [authed])

  // Enlace directo a una ficha: cargamos la propiedad por su referencia
  useEffect(() => {
    if (!authed || section !== 'prop_detail' || selectedProp?.ref === propRef) return
    supabase.from('propiedades').select('*').eq('ref', propRef).maybeSingle()
      .then(({ data }) => setSelectedProp((data as Propiedad | null) ?? null))
  }, [authed, section, propRef, selectedProp?.ref])

  // PWA: «Añadir a pantalla de inicio» abre el CRM como app
  useEffect(() => {
    const tags = [
      ['link', { rel: 'manifest', href: '/admin.webmanifest' }],
      ['link', { rel: 'apple-touch-icon', href: '/admin-icon-180.png' }],
      ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
      ['meta', { name: 'mobile-web-app-capable', content: 'yes' }],
      ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }],
      ['meta', { name: 'apple-mobile-web-app-title', content: 'qimmo CRM' }],
      ['meta', { name: 'theme-color', content: '#FBFBFC' }],
    ] as const
    const els = tags.map(([tag, attrs]) => {
      const el = document.createElement(tag)
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
      document.head.appendChild(el)
      return el
    })
    const prevTitle = document.title
    document.title = 'qimmo CRM'
    return () => { els.forEach(e => e.remove()); document.title = prevTitle }
  }, [])

  // ⌘K / Ctrl+K abre la paleta de comandos
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCmdOpen(o => !o) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!cmdOpen || cmdData) return
    Promise.all([
      supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(300),
      supabase.from('propiedades').select('*').order('created_at', { ascending: false }),
      supabase.from('invoices').select('number,client_name,total').eq('accounting', 'A').order('issued_at', { ascending: false }),
    ]).then(([l, p, i]) => setCmdData({
      leads: (l.data ?? []) as Lead[], props: (p.data ?? []) as Propiedad[], invoices: i.data ?? [],
    }))
  }, [cmdOpen, cmdData])

  if (authed === null) return null
  if (!authed) return <Login />

  const logout = () => { supabase.auth.signOut() }

  const goTo = (s: Section) => {
    if (s !== 'prop_detail') navigate(PATHS[s] ? `/admin/${PATHS[s]}` : '/admin')
    setMobileMenuOpen(false)
  }

  const handleSelectProp = (p: Propiedad) => {
    setSelectedProp(p)
    navigate(`/admin/properties/${encodeURIComponent(p.ref)}`)
  }

  const NAV = [
    { id: 'inicio'      as Section, icon: LayoutDashboard, label: 'Inicio',    badge: undefined },
    { id: 'pipeline'    as Section, icon: Users,    label: 'Pipeline',     badge: newLeadsCount },
    { id: 'propiedades' as Section, icon: Home,     label: 'Propiedades',  badge: undefined },
    { id: 'visitas'     as Section, icon: Calendar, label: 'Visitas',      badge: undefined },
    { id: 'facturas'    as Section, icon: Receipt,  label: 'Facturación',  badge: undefined },
    { id: 'mandato'     as Section, icon: FileText, label: 'Mandato',      badge: undefined },
    { id: 'blog'        as Section, icon: BookOpen, label: 'Blog',         badge: undefined },
  ]

  // Pestañas fijas de la barra inferior en móvil; el resto va en «Más»
  const TABS = NAV.filter(n => ['inicio', 'pipeline', 'visitas', 'facturas'].includes(n.id))

  const commands: CommandItem[] = [
    ...NAV.map(n => ({ id: `nav-${n.id}`, group: 'Ir a', label: n.label, icon: <n.icon size={15} />, run: () => goTo(n.id) })),
    { id: 'nav-gastos', group: 'Ir a', label: 'Gastos', hint: 'Facturación', icon: <Wallet size={15} />, run: () => goTo('gastos') },
    { id: 'nav-resultado', group: 'Ir a', label: 'Resultado (P&L)', hint: 'Facturación', icon: <Wallet size={15} />, run: () => goTo('resultado') },
    { id: 'act-web', group: 'Acciones', label: 'Ver la web pública', icon: <MapPin size={15} />, run: () => window.open('/', '_blank') },
    { id: 'act-logout', group: 'Acciones', label: 'Cerrar sesión', icon: <LogOut size={15} />, run: logout },
    ...(cmdData?.leads ?? []).map(l => ({
      id: `lead-${l.id}`, group: 'Leads', label: l.nombre, hint: [l.telefono, l.email].filter(Boolean).join(' · '),
      icon: <Users size={15} />, run: () => goTo('pipeline'),
    })),
    ...(cmdData?.props ?? []).map(p => ({
      id: `prop-${p.id}`, group: 'Propiedades', label: p.titulo, hint: `${p.ref} · ${p.barrio || p.zona}`,
      icon: <Home size={15} />, run: () => handleSelectProp(p),
    })),
    ...(cmdData?.invoices ?? []).map(i => ({
      id: `inv-${i.number}`, group: 'Facturas', label: `${i.number} · ${i.client_name ?? ''}`,
      hint: i.total != null ? fmt(Math.round(Number(i.total) * 100) / 100) : undefined,
      icon: <Receipt size={15} />, run: () => goTo('facturas'),
    })),
  ]

  const activeSection = section === 'prop_detail' ? 'propiedades' : BILLING.includes(section) ? 'facturas' : section
  const billingTabs = (
    <SegmentedControl id="billing-tab" value={section} onChange={goTo} options={[
      { value: 'facturas' as Section, label: 'Facturas' },
      { value: 'gastos' as Section, label: 'Gastos' },
      { value: 'resultado' as Section, label: 'Resultado' },
    ]} />
  )

  return (
    <div className="arc min-h-screen flex">
      <ToastStack toasts={toasts} onDismiss={dismiss} />
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} items={commands} loading={!cmdData} />

      {/* ── SIDEBAR ── */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 sticky top-0 h-screen"
        style={{ borderRight: '1px solid var(--border)', background: 'var(--surface-muted)' }}>
        <div className="px-5 pt-5 pb-4">
          <Logo width={96} />
          <p className="text-[10px] font-semibold uppercase tracking-widest mt-2" style={{ color: 'var(--gold)' }}>CRM</p>
        </div>
        <div className="px-3 pb-3"><SearchButton onClick={() => setCmdOpen(true)} /></div>

        <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto">
          {NAV.map(n => (
            <NavItem key={n.id} icon={n.icon} label={n.label} badge={n.badge} layoutGroup="desktop"
              active={activeSection === n.id} onClick={() => goTo(n.id)} />
          ))}
        </nav>

        <div className="px-3 py-4 space-y-0.5" style={{ borderTop: '1px solid var(--border)' }}>
          {!supabaseReady && (
            <div className="mx-1 mb-3 px-3 py-2 rounded-lg" style={{ background: '#FEF3C7', border: '1px solid #FCD34D' }}>
              <p className="text-[10px] font-semibold" style={{ color: '#92400E' }}>Supabase no configurado</p>
              <p className="text-[10px]" style={{ color: '#B45309' }}>Añade las variables de entorno en Cloudflare</p>
            </div>
          )}
          <a href="/" target="_blank" className="arc-row flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm w-full"
            style={{ color: 'var(--text-muted)' }}>
            <MapPin size={15} /> Ver web
          </a>
          <button onClick={logout} className="arc-row flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm w-full"
            style={{ color: 'var(--text-muted)' }}>
            <LogOut size={15} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── MOBILE TOPBAR ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center px-4 gap-3"
        style={{ height: 'calc(56px + env(safe-area-inset-top))', paddingTop: 'env(safe-area-inset-top)',
          borderBottom: '1px solid var(--border)', background: 'color-mix(in oklch, var(--surface) 88%, transparent)',
          backdropFilter: 'saturate(1.6) blur(14px)', WebkitBackdropFilter: 'saturate(1.6) blur(14px)' }}>
        <Logo width={72} />
        <div className="flex-1" />
        <SearchButton compact onClick={() => setCmdOpen(true)} />
      </div>

      {/* ── MOBILE TAB BAR (como app nativa) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)', borderTop: '1px solid var(--border)',
          background: 'color-mix(in oklch, var(--surface) 90%, transparent)',
          backdropFilter: 'saturate(1.6) blur(14px)', WebkitBackdropFilter: 'saturate(1.6) blur(14px)' }}>
        {[...TABS, { id: 'more' as const, icon: MoreHorizontal, label: 'Más', badge: undefined }].map(t => {
          const active = t.id === 'more' ? mobileMenuOpen : (!mobileMenuOpen && activeSection === t.id)
          return (
            <motion.button key={t.id} whileTap={{ scale: 0.9 }} transition={spring.snappy}
              onClick={() => t.id === 'more' ? setMobileMenuOpen(v => !v) : goTo(t.id)}
              className="relative flex-1 flex flex-col items-center gap-0.5 pt-2 pb-1.5 text-[10px] font-medium"
              style={{ color: active ? 'var(--accent)' : 'var(--text-muted)' }}>
              <span className="relative">
                <t.icon size={21} strokeWidth={active ? 2.2 : 1.8} />
                {t.badge != null && t.badge > 0 && (
                  <span className="absolute -top-1 -right-2.5 min-w-4 h-4 px-1 rounded-full grid place-items-center text-[9px] font-bold text-white"
                    style={{ background: 'var(--gold)' }}>{t.badge}</span>
                )}
              </span>
              {t.label}
            </motion.button>
          )
        })}
      </nav>

      {/* Hoja «Más» */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div className="md:hidden fixed inset-0 z-30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ background: 'color-mix(in oklch, #0D1F3C 25%, transparent)' }} onClick={() => setMobileMenuOpen(false)}>
            <motion.div className="absolute left-2 right-2 p-2 space-y-0.5 rounded-[var(--radius-surface)]"
              style={{ bottom: 'calc(64px + env(safe-area-inset-bottom))', background: 'var(--surface)', boxShadow: 'var(--shadow-floating)' }}
              initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} transition={spring.gentle}
              onClick={e => e.stopPropagation()}>
              {NAV.filter(n => !TABS.some(t => t.id === n.id)).map(n => (
                <NavItem key={n.id} icon={n.icon} label={n.label} badge={n.badge} layoutGroup="mobile"
                  active={activeSection === n.id} onClick={() => goTo(n.id)} />
              ))}
              <div className="pt-1 mt-1" style={{ borderTop: '1px solid var(--border)' }}>
                <a href="/" target="_blank" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm" style={{ color: 'var(--text-muted)' }}>
                  <MapPin size={16} /> Ver web
                </a>
                <button onClick={logout} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm w-full" style={{ color: 'var(--text-muted)' }}>
                  <LogOut size={16} /> Cerrar sesión
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 min-w-0 md:!pt-0 md:!pb-0"
        style={{ paddingTop: 'calc(56px + env(safe-area-inset-top))', paddingBottom: 'calc(72px + env(safe-area-inset-bottom))' }}>
        <motion.div key={BILLING.includes(section) ? 'billing' : section} {...sectionEnter} className="px-4 sm:px-5 lg:px-8 py-6 md:py-8">
          {section === 'inicio' && <SectionInicio go={goTo} />}
          {section === 'pipeline' && <SectionPipeline notify={notify} />}
          {section === 'propiedades' && <SectionPropiedades notify={notify} onSelectProp={handleSelectProp} />}
          {section === 'prop_detail' && selectedProp && (
            <SectionPropDetail prop={selectedProp} onBack={() => goTo('propiedades')} notify={notify} />
          )}
          {section === 'visitas' && <SectionVisitas notify={notify} />}
          {section === 'mandato' && (
            <div style={{ height: '100vh', margin: '-32px -32px 0' }}>
              <iframe src="/mandato.html" title="Generar Mandato" style={{ width: '100%', height: '100%', border: 'none' }} />
            </div>
          )}
          {section === 'blog' && <SectionBlog notify={notify} />}
          {BILLING.includes(section) && (
            <div className="max-w-6xl">
              <h1 className="font-jakarta font-bold text-2xl mb-4">Facturación</h1>
              {section === 'facturas'
                ? <SectionFacturas notify={notify} tabs={billingTabs} />
                : <SectionFinanzas key={section} notify={notify} tab={section === 'gastos' ? 'gastos' : 'resultado'} tabs={billingTabs} />}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
