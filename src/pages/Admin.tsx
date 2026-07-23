import { useState, useEffect, useRef } from 'react'
import {
  supabase, supabaseReady, type Propiedad, type TipoProp, type ZonaProp,
  type EnergiaCert, type BadgeProp,
} from '../lib/supabase'
import {
  Plus, Pencil, Trash2, Eye, EyeOff, X, CheckCircle, AlertCircle,
  LogOut, ImagePlus, Loader2, ChevronRight, Users, Home, Calendar,
  Phone, Mail, MessageSquare, ArrowLeft, Clock, MapPin, Building2,
  ChevronDown, ChevronUp, Star, FileText, BookOpen,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
interface Lead {
  id: number
  nombre: string
  telefono: string
  email: string
  tipo: 'valoracion' | 'contacto' | 'interes_propiedad' | 'visita'
  mensaje: string | null
  propiedad_ref: string | null
  estado: 'nuevo' | 'contactado' | 'en_proceso' | 'cerrado' | 'descartado'
  notas: string | null
  created_at: string
}

interface Visita {
  id: number
  propiedad_ref: string
  propiedad_titulo: string
  nombre: string
  telefono: string
  email: string
  fecha: string
  hora: string
  estado: 'pendiente' | 'confirmada' | 'realizada' | 'cancelada'
  notas: string | null
  created_at: string
}

type Section = 'pipeline' | 'propiedades' | 'prop_detail' | 'visitas' | 'mandato' | 'blog'

// ── Config ────────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'qimmo2025'
const SESSION_KEY    = 'qimmo_admin_auth'

const TIPOS:    TipoProp[]    = ['Piso', 'Àtic', 'Duplex', 'Casa', 'Local', 'Oficina', 'Nave']
const ZONAS:    ZonaProp[]    = ['Barcelona', 'Zona Alta', 'Área Metropolitana', 'Costa Daurada', 'Vallès']
const ENERGIAS: EnergiaCert[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
const BADGES:   (BadgeProp | '')[] = ['', 'Nueva incorporación', 'Off-market', 'Inversión', 'Precio reducido']

const LEAD_ESTADOS: Lead['estado'][]   = ['nuevo', 'contactado', 'en_proceso', 'cerrado', 'descartado']
const VISITA_ESTADOS: Visita['estado'][] = ['pendiente', 'confirmada', 'realizada', 'cancelada']

const ESTADO_LABEL: Record<string, string> = {
  nuevo: 'Nuevo', contactado: 'Contactado', en_proceso: 'En proceso',
  cerrado: 'Cerrado', descartado: 'Descartado',
  pendiente: 'Pendiente', confirmada: 'Confirmada', realizada: 'Realizada', cancelada: 'Cancelada',
}

const ESTADO_COLOR: Record<string, { bg: string; text: string }> = {
  nuevo:       { bg: '#EFF6FF', text: '#2563EB' },
  contactado:  { bg: '#F0FDF4', text: '#16A34A' },
  en_proceso:  { bg: '#FEF9EE', text: '#D97706' },
  cerrado:     { bg: '#F3F4F6', text: '#6B7280' },
  descartado:  { bg: '#FEF2F2', text: '#DC2626' },
  pendiente:   { bg: '#FEF9EE', text: '#D97706' },
  confirmada:  { bg: '#F0FDF4', text: '#16A34A' },
  realizada:   { bg: '#F3F4F6', text: '#6B7280' },
  cancelada:   { bg: '#FEF2F2', text: '#DC2626' },
}

const EMPTY_FORM = {
  ref: '', titulo: '', tipo: 'Piso' as TipoProp, zona: 'Barcelona' as ZonaProp,
  barrio: '', direccion: '', precio: '', m2: '', habitaciones: '', banos: '',
  planta: '', terraza: false, garage: false, ascensor: false, piscina: false,
  badge: '' as BadgeProp | '', descripcion: '', caracteristicas: '', energia: 'D' as EnergiaCert,
  lat: '41.3874', lng: '2.1686', publicado: false,
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n: number) { return n.toLocaleString('es-ES') + ' €' }
function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}
function fmtDateShort(s: string) {
  return new Date(s).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, ok, onClose }: { msg: string; ok: boolean; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className="fixed top-6 right-6 z-[200] flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl"
      style={{ background: ok ? '#0D1F3C' : '#DC2626', color: 'white', maxWidth: 360 }}>
      {ok ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      <span className="font-inter text-sm flex-1">{msg}</span>
      <button onClick={onClose}><X size={14} /></button>
    </div>
  )
}

// ── Login ─────────────────────────────────────────────────────────────────────
function Login({ onLogin }: { onLogin: () => void }) {
  const [pwd, setPwd] = useState('')
  const [err, setErr] = useState(false)
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pwd === ADMIN_PASSWORD) { sessionStorage.setItem(SESSION_KEY, '1'); onLogin() }
    else { setErr(true); setPwd('') }
  }
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D1F3C' }}>
      <div className="bg-white rounded-2xl p-10 w-full max-w-sm shadow-2xl">
        <img src="/LOGO QIMMO BLUE.png" alt="qimmo" className="h-12 w-auto mb-8 mx-auto" />
        <h1 className="font-jakarta font-bold text-navy text-xl text-center mb-6">Admin · qimmo</h1>
        <form onSubmit={submit} className="space-y-4">
          <input type="password" placeholder="Contraseña" value={pwd} autoFocus
            onChange={e => { setPwd(e.target.value); setErr(false) }} className="input w-full" />
          {err && <p className="font-inter text-xs text-red-500">Contraseña incorrecta</p>}
          <button type="submit" className="btn-primary w-full justify-center">Entrar</button>
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

// ── Lead card ─────────────────────────────────────────────────────────────────
function LeadCard({ lead, onUpdate }: { lead: Lead; onUpdate: (id: number, changes: Partial<Lead>) => void }) {
  const [expanded, setExpanded] = useState(false)
  const [estado, setEstado]     = useState<Lead['estado']>(lead.estado)
  const [notas, setNotas]       = useState(lead.notas ?? '')
  const [saving, setSaving]     = useState(false)

  const saveNotas = async () => {
    setSaving(true)
    await supabase.from('leads').update({ notas, estado }).eq('id', lead.id)
    onUpdate(lead.id, { notas, estado })
    setSaving(false)
  }

  const changeEstado = async (e: Lead['estado']) => {
    setEstado(e)
    await supabase.from('leads').update({ estado: e }).eq('id', lead.id)
    onUpdate(lead.id, { estado: e })
  }

  const col = ESTADO_COLOR[estado] ?? ESTADO_COLOR.nuevo
  const tipoLabel: Record<string, string> = {
    valoracion: 'Valoración', contacto: 'Contacto',
    interes_propiedad: 'Interés propiedad', visita: 'Visita',
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #E2E0DA' }}>
      <div className="px-4 py-3 flex items-center gap-3 cursor-pointer" onClick={() => setExpanded(v => !v)}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-jakarta font-bold text-sm text-white"
          style={{ background: '#0D1F3C' }}>
          {lead.nombre[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-jakarta font-bold text-navy text-sm">{lead.nombre}</p>
          <p className="font-inter text-xs truncate" style={{ color: '#9CA3AF' }}>
            {tipoLabel[lead.tipo] ?? lead.tipo} · {fmtDate(lead.created_at)}
          </p>
        </div>
        <span className="px-2 py-0.5 rounded-full font-inter text-[10px] font-semibold shrink-0"
          style={{ background: col.bg, color: col.text }}>
          {ESTADO_LABEL[estado]}
        </span>
        {expanded ? <ChevronUp size={14} style={{ color: '#9CA3AF' }} /> : <ChevronDown size={14} style={{ color: '#9CA3AF' }} />}
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3" style={{ borderTop: '1px solid #F0EDE8' }}>
          <div className="flex flex-wrap gap-3 pt-3">
            {lead.telefono && (
              <a href={`tel:${lead.telefono}`} className="flex items-center gap-1.5 font-inter text-xs" style={{ color: '#0D1F3C' }}>
                <Phone size={12} /> {lead.telefono}
              </a>
            )}
            {lead.email && (
              <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 font-inter text-xs" style={{ color: '#0D1F3C' }}>
                <Mail size={12} /> {lead.email}
              </a>
            )}
            {lead.propiedad_ref && (
              <span className="flex items-center gap-1.5 font-inter text-xs" style={{ color: '#C49A3C' }}>
                <Building2 size={12} /> Ref: {lead.propiedad_ref}
              </span>
            )}
          </div>
          {lead.mensaje && (
            <div className="rounded-lg p-3" style={{ background: '#F7F6F2' }}>
              <p className="font-inter text-xs leading-relaxed" style={{ color: '#4B5563' }}>{lead.mensaje}</p>
            </div>
          )}
          <div>
            <label className="font-inter text-[10px] font-semibold uppercase tracking-widest mb-1.5 block" style={{ color: '#9CA3AF' }}>Estado</label>
            <div className="flex flex-wrap gap-1.5">
              {LEAD_ESTADOS.map(e => {
                const c = ESTADO_COLOR[e]
                return (
                  <button key={e} onClick={() => changeEstado(e)}
                    className="px-2.5 py-1 rounded-full font-inter text-[10px] font-semibold border transition-all"
                    style={{
                      background: estado === e ? c.bg : 'transparent',
                      color: estado === e ? c.text : '#9CA3AF',
                      borderColor: estado === e ? c.text : '#E2E0DA',
                    }}>
                    {ESTADO_LABEL[e]}
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <label className="font-inter text-[10px] font-semibold uppercase tracking-widest mb-1.5 block" style={{ color: '#9CA3AF' }}>Notas internas</label>
            <textarea className="input w-full resize-none text-xs" rows={2} placeholder="Añade notas…"
              value={notas} onChange={e => setNotas(e.target.value)} />
            <button onClick={saveNotas} disabled={saving}
              className="mt-1.5 flex items-center gap-1 font-inter text-xs font-semibold"
              style={{ color: '#C49A3C' }}>
              {saving ? <Loader2 size={11} className="animate-spin" /> : <CheckCircle size={11} />}
              Guardar notas
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── SECTION: Pipeline ─────────────────────────────────────────────────────────
function SectionPipeline({ notify }: { notify: (m: string, ok?: boolean) => void }) {
  const [leads, setLeads]         = useState<Lead[]>([])
  const [loading, setLoading]     = useState(true)
  const [filter, setFilter]       = useState<Lead['estado'] | 'todos'>('todos')

  useEffect(() => {
    if (!supabaseReady) { setLoading(false); return }
    supabase.from('leads').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        setLoading(false)
        if (error) { notify(error.message, false); return }
        setLeads((data ?? []) as Lead[])
      })
  }, [])

  const update = (id: number, changes: Partial<Lead>) =>
    setLeads(ls => ls.map(l => l.id === id ? { ...l, ...changes } : l))

  const filtered = filter === 'todos' ? leads : leads.filter(l => l.estado === filter)

  const counts = LEAD_ESTADOS.reduce((acc, e) => {
    acc[e] = leads.filter(l => l.estado === e).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-jakarta font-bold text-navy text-2xl">Pipeline</h1>
          <p className="font-inter text-sm mt-1" style={{ color: '#9CA3AF' }}>{leads.length} leads totales</p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['todos', ...LEAD_ESTADOS] as const).map(e => {
          const col = e === 'todos' ? { bg: '#F0F4FA', text: '#0D1F3C' } : ESTADO_COLOR[e]
          const count = e === 'todos' ? leads.length : counts[e] ?? 0
          const active = filter === e
          return (
            <button key={e} onClick={() => setFilter(e)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-inter text-xs font-semibold border transition-all"
              style={{
                background: active ? col.bg : 'transparent',
                color: active ? col.text : '#9CA3AF',
                borderColor: active ? col.text + '40' : '#E2E0DA',
              }}>
              {e === 'todos' ? 'Todos' : ESTADO_LABEL[e]}
              <span className="px-1.5 py-0.5 rounded-full text-[10px]"
                style={{ background: active ? col.text + '20' : '#F0F0F0', color: active ? col.text : '#9CA3AF' }}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin" style={{ color: '#C49A3C' }} /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-jakarta font-bold text-navy mb-2">Sin leads {filter !== 'todos' ? `"${ESTADO_LABEL[filter]}"` : ''}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(l => <LeadCard key={l.id} lead={l} onUpdate={update} />)}
        </div>
      )}
    </div>
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

  const eliminar = async (p: Propiedad) => {
    if (!confirm(`¿Eliminar "${p.titulo}"? Esta acción no se puede deshacer.`)) return
    const { error } = await supabase.from('propiedades').delete().eq('id', p.id)
    if (error) { notify(error.message, false); return }
    setProps(ps => ps.filter(x => x.id !== p.id))
    notify('Propiedad eliminada')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-jakarta font-bold text-navy text-2xl">Propiedades</h1>
          <p className="font-inter text-sm mt-1" style={{ color: '#9CA3AF' }}>
            {props.filter(p => p.publicado).length} publicadas · {props.filter(p => !p.publicado).length} borradores
          </p>
        </div>
        <button onClick={() => setModal('new')} className="btn-primary gap-2">
          <Plus size={15} /> Nueva propiedad
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin" style={{ color: '#C49A3C' }} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {props.map(p => (
            <div key={p.id} className="bg-white rounded-2xl overflow-hidden cursor-pointer group transition-shadow hover:shadow-md"
              style={{ border: '1px solid #E2E0DA' }}
              onClick={() => onSelectProp(p)}>
              <div className="relative h-40 overflow-hidden">
                {p.imagen
                  ? <img src={p.imagen} alt={p.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  : <div className="w-full h-full flex items-center justify-center" style={{ background: '#F0F4FA' }}>
                      <Home size={32} style={{ color: '#C4C0B8' }} />
                    </div>}
                <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md"
                    style={{ background: 'rgba(0,0,0,0.6)', color: '#C49A3C' }}>{p.ref}</span>
                  <button onClick={e => { e.stopPropagation(); togglePublicado(p) }}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full font-inter text-[10px] font-semibold"
                    style={{ background: p.publicado ? '#ECFDF5' : 'rgba(0,0,0,0.5)', color: p.publicado ? '#059669' : 'white' }}>
                    {p.publicado ? <Eye size={10} /> : <EyeOff size={10} />}
                    {p.publicado ? 'Publicada' : 'Borrador'}
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className="font-inter text-xs mb-1" style={{ color: '#9CA3AF' }}>{p.barrio} · {p.tipo}</p>
                <p className="font-jakarta font-bold text-navy mb-2 line-clamp-1">{p.titulo}</p>
                <div className="flex items-center justify-between">
                  <span className="font-jakarta font-bold text-navy">{fmt(p.precio)}</span>
                  <div className="flex gap-1">
                    <button onClick={e => { e.stopPropagation(); eliminar(p) }}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: '#9CA3AF' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#DC2626' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9CA3AF' }}>
                      <Trash2 size={13} />
                    </button>
                    <ChevronRight size={16} style={{ color: '#9CA3AF', marginTop: 4 }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New property modal */}
      {modal === 'new' && (
        <div className="fixed inset-0 z-50 flex items-start justify-center py-8 px-4 overflow-y-auto"
          style={{ background: 'rgba(13,31,60,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl my-auto">
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
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="flex items-center gap-1.5 font-inter text-sm" style={{ color: '#6B7280' }}>
          <ArrowLeft size={15} /> Propiedades
        </button>
        <ChevronRight size={14} style={{ color: '#C4C0B8' }} />
        <span className="font-mono text-sm font-semibold" style={{ color: '#C49A3C' }}>{current.ref}</span>
      </div>

      {/* Hero */}
      <div className="bg-white rounded-2xl overflow-hidden mb-6" style={{ border: '1px solid #E2E0DA' }}>
        <div className="relative h-52 overflow-hidden">
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
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: '1px solid #E2E0DA' }}>
          <div className="flex gap-4 font-inter text-sm" style={{ color: '#6B7280' }}>
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
      <div className="flex gap-1 mb-5 p-1 rounded-xl" style={{ background: '#F0F4FA' }}>
        {(['info', 'leads'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-lg font-inter text-sm font-semibold transition-all"
            style={{
              background: tab === t ? 'white' : 'transparent',
              color: tab === t ? '#0D1F3C' : '#9CA3AF',
              boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}>
            {t === 'info' ? 'Información' : `Leads (${leads.length})`}
          </button>
        ))}
      </div>

      {tab === 'info' && (
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Dirección', val: current.direccion || '—' },
            { label: 'Zona', val: current.zona },
            { label: 'Precio/m²', val: current.m2 ? `${Math.round(current.precio / current.m2).toLocaleString('es-ES')} €/m²` : '—' },
            { label: 'Cert. energético', val: current.energia },
            { label: 'Planta', val: current.planta ?? '—' },
            { label: 'Referencia', val: current.ref },
          ].map(({ label, val }) => (
            <div key={label} className="card">
              <p className="font-inter text-[10px] uppercase tracking-widest mb-1" style={{ color: '#9CA3AF' }}>{label}</p>
              <p className="font-jakarta font-bold text-navy text-sm">{val}</p>
            </div>
          ))}
          {current.descripcion && (
            <div className="card col-span-2">
              <p className="font-inter text-[10px] uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>Descripción</p>
              <p className="font-inter text-sm leading-relaxed" style={{ color: '#4B5563' }}>{current.descripcion}</p>
            </div>
          )}
          {current.caracteristicas?.length > 0 && (
            <div className="card col-span-2">
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
          : <div className="space-y-2">{leads.map(l => <LeadCard key={l.id} lead={l} onUpdate={updateLead} />)}</div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center py-8 px-4 overflow-y-auto"
          style={{ background: 'rgba(13,31,60,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl my-auto">
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

// ── SECTION: Visitas ──────────────────────────────────────────────────────────
function SectionVisitas({ notify }: { notify: (m: string, ok?: boolean) => void }) {
  const [visitas, setVisitas] = useState<Visita[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabaseReady) { setLoading(false); return }
    supabase.from('visitas').select('*').order('fecha', { ascending: true }).order('hora', { ascending: true })
      .then(({ data, error }) => {
        setLoading(false)
        if (error) { notify(error.message, false); return }
        setVisitas((data ?? []) as Visita[])
      })
  }, [])

  const changeEstado = async (id: number, estado: Visita['estado']) => {
    await supabase.from('visitas').update({ estado }).eq('id', id)
    setVisitas(vs => vs.map(v => v.id === id ? { ...v, estado } : v))
  }

  // Group visitas by date for calendar view
  const today     = new Date().toISOString().split('T')[0]
  const upcoming  = visitas.filter(v => v.fecha >= today && v.estado !== 'cancelada')
  const past      = visitas.filter(v => v.fecha < today || v.estado === 'cancelada')

  const VisitaRow = ({ v }: { v: Visita }) => {
    const col = ESTADO_COLOR[v.estado] ?? ESTADO_COLOR.pendiente
    return (
      <div className="bg-white rounded-xl px-4 py-3 flex items-center gap-4" style={{ border: '1px solid #E2E0DA' }}>
        {/* Date badge */}
        <div className="w-12 text-center shrink-0">
          <p className="font-jakarta font-black text-navy text-lg leading-none">{new Date(v.fecha + 'T00:00').getDate()}</p>
          <p className="font-inter text-[10px] uppercase tracking-wide" style={{ color: '#9CA3AF' }}>
            {new Date(v.fecha + 'T00:00').toLocaleDateString('es-ES', { month: 'short' })}
          </p>
        </div>
        {/* Divider */}
        <div className="w-px h-10 shrink-0" style={{ background: '#E2E0DA' }} />
        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-jakarta font-bold text-navy text-sm">{v.nombre}</p>
          <p className="font-inter text-xs truncate" style={{ color: '#9CA3AF' }}>
            <span style={{ color: '#C49A3C' }}>{v.propiedad_ref}</span>
            {v.propiedad_titulo && ` · ${v.propiedad_titulo}`}
          </p>
        </div>
        {/* Time */}
        <div className="flex items-center gap-1 font-inter text-sm font-semibold shrink-0" style={{ color: '#0D1F3C' }}>
          <Clock size={13} style={{ color: '#9CA3AF' }} />
          {v.hora.slice(0, 5)}
        </div>
        {/* Contact */}
        <div className="hidden md:flex gap-2 shrink-0">
          {v.telefono && <a href={`tel:${v.telefono}`} className="p-1.5 rounded-lg" style={{ color: '#6B7280' }}><Phone size={14} /></a>}
          {v.email    && <a href={`mailto:${v.email}`} className="p-1.5 rounded-lg" style={{ color: '#6B7280' }}><Mail size={14} /></a>}
        </div>
        {/* Estado */}
        <select value={v.estado}
          onChange={e => changeEstado(v.id, e.target.value as Visita['estado'])}
          className="font-inter text-xs font-semibold px-2 py-1 rounded-full border-0 outline-none cursor-pointer"
          style={{ background: col.bg, color: col.text }}
          onClick={e => e.stopPropagation()}>
          {VISITA_ESTADOS.map(e => <option key={e} value={e}>{ESTADO_LABEL[e]}</option>)}
        </select>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-jakarta font-bold text-navy text-2xl">Visitas</h1>
        <p className="font-inter text-sm mt-1" style={{ color: '#9CA3AF' }}>
          {upcoming.length} próximas · {past.length} pasadas/canceladas
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin" style={{ color: '#C49A3C' }} /></div>
      ) : visitas.length === 0 ? (
        <div className="text-center py-20">
          <Calendar size={40} className="mx-auto mb-3" style={{ color: '#E2E0DA' }} />
          <p className="font-jakarta font-bold text-navy mb-2">Sin visitas registradas</p>
          <p className="font-inter text-sm" style={{ color: '#9CA3AF' }}>Las visitas agendadas desde la web aparecerán aquí</p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="mb-8">
              <p className="font-inter text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#9CA3AF' }}>Próximas visitas</p>
              <div className="space-y-2">{upcoming.map(v => <VisitaRow key={v.id} v={v} />)}</div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <p className="font-inter text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#9CA3AF' }}>Pasadas / canceladas</p>
              <div className="space-y-2 opacity-60">{past.map(v => <VisitaRow key={v.id} v={v} />)}</div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ── Sidebar nav item ──────────────────────────────────────────────────────────
function NavItem({ icon: Icon, label, active, badge, onClick }: {
  icon: React.FC<{ size?: number; style?: React.CSSProperties }>
  label: string; active: boolean; badge?: number; onClick: () => void
}) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left"
      style={{
        background: active ? '#F0F4FA' : 'transparent',
        color: active ? '#0D1F3C' : '#6B7280',
      }}>
      <Icon size={17} style={{ color: active ? '#0D1F3C' : '#9CA3AF' }} />
      <span className="font-inter text-sm font-semibold flex-1">{label}</span>
      {badge != null && badge > 0 && (
        <span className="px-2 py-0.5 rounded-full font-inter text-[10px] font-bold"
          style={{ background: '#EFF6FF', color: '#2563EB' }}>{badge}</span>
      )}
    </button>
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
function SectionMandato() {
  return (
    <div style={{ height: 'calc(100vh - 56px)', margin: '0 -16px' }}>
      <iframe
        src="/mandato.html"
        title="Generar Mandato"
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed]       = useState(() => sessionStorage.getItem(SESSION_KEY) === '1')
  const [section, setSection]     = useState<Section>('pipeline')
  const [selectedProp, setSelectedProp] = useState<Propiedad | null>(null)
  const [toast, setToast]         = useState<{ msg: string; ok: boolean } | null>(null)
  const [newLeadsCount, setNewLeadsCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const notify = (msg: string, ok = true) => setToast({ msg, ok })

  useEffect(() => {
    if (!authed || !supabaseReady) return
    supabase.from('leads').select('id', { count: 'exact' }).eq('estado', 'nuevo')
      .then(({ count }) => setNewLeadsCount(count ?? 0))
  }, [authed])

  if (!authed) return <Login onLogin={() => setAuthed(true)} />

  const logout = () => { sessionStorage.removeItem(SESSION_KEY); setAuthed(false) }

  const goTo = (s: Section) => {
    setSection(s)
    if (s !== 'prop_detail') setSelectedProp(null)
    setMobileMenuOpen(false)
  }

  const handleSelectProp = (p: Propiedad) => {
    setSelectedProp(p)
    setSection('prop_detail')
  }

  const NAV = [
    { id: 'pipeline'    as Section, icon: Users,    label: 'Pipeline',     badge: newLeadsCount },
    { id: 'propiedades' as Section, icon: Home,     label: 'Propiedades',  badge: undefined },
    { id: 'visitas'     as Section, icon: Calendar, label: 'Visitas',      badge: undefined },
    { id: 'mandato'     as Section, icon: FileText, label: 'Mandato',      badge: undefined },
    { id: 'blog'        as Section, icon: BookOpen, label: 'Blog',         badge: undefined },
  ]

  const activeSection = section === 'prop_detail' ? 'propiedades' : section

  return (
    <div className="min-h-screen flex" style={{ background: '#F7F6F2' }}>
      {toast && <Toast msg={toast.msg} ok={toast.ok} onClose={() => setToast(null)} />}

      {/* ── SIDEBAR ── */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 sticky top-0 h-screen bg-white"
        style={{ borderRight: '1px solid #E2E0DA' }}>
        {/* Logo */}
        <div className="px-5 py-5" style={{ borderBottom: '1px solid #E2E0DA' }}>
          <img src="/LOGO QIMMO BLUE.png" alt="qimmo" className="h-10 w-auto" />
          <p className="font-inter text-[10px] font-semibold uppercase tracking-widest mt-1" style={{ color: '#C49A3C' }}>
            CRM · Admin
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(n => (
            <NavItem key={n.id} icon={n.icon} label={n.label} badge={n.badge}
              active={activeSection === n.id} onClick={() => goTo(n.id)} />
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 space-y-1" style={{ borderTop: '1px solid #E2E0DA' }}>
          {!supabaseReady && (
            <div className="mx-1 mb-3 px-3 py-2 rounded-lg" style={{ background: '#FEF3C7', border: '1px solid #FCD34D' }}>
              <p className="font-inter text-[10px] font-semibold" style={{ color: '#92400E' }}>Supabase no configurado</p>
              <p className="font-inter text-[10px]" style={{ color: '#B45309' }}>Añade las variables de entorno en Cloudflare</p>
            </div>
          )}
          <a href="/" target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-inter text-sm transition-all w-full"
            style={{ color: '#9CA3AF' }}>
            <MapPin size={15} /> Ver web
          </a>
          <button onClick={logout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-inter text-sm transition-all w-full"
            style={{ color: '#9CA3AF' }}>
            <LogOut size={15} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── MOBILE TOPBAR ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white h-14 flex items-center px-4 gap-3"
        style={{ borderBottom: '1px solid #E2E0DA' }}>
        <img src="/LOGO QIMMO BLUE.png" alt="qimmo" className="h-9 w-auto" />
        <span className="font-inter text-xs font-semibold uppercase tracking-widest" style={{ color: '#C49A3C' }}>Admin</span>
        <div className="flex-1" />
        <button onClick={() => setMobileMenuOpen(v => !v)} className="p-2" style={{ color: '#6B7280' }}>
          {mobileMenuOpen ? <X size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-14 left-0 right-0 z-40 bg-white shadow-lg px-3 py-3 space-y-1"
          style={{ borderBottom: '1px solid #E2E0DA' }}>
          {NAV.map(n => (
            <NavItem key={n.id} icon={n.icon} label={n.label} badge={n.badge}
              active={activeSection === n.id} onClick={() => goTo(n.id)} />
          ))}
          <button onClick={logout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-inter text-sm w-full mt-2"
            style={{ color: '#9CA3AF', borderTop: '1px solid #E2E0DA' }}>
            <LogOut size={15} /> Cerrar sesión
          </button>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 min-w-0 pt-0 md:pt-0 mt-14 md:mt-0">
        <div className={`px-6 lg:px-8 py-8 ${section === 'mandato' ? 'p-0' : ''}`}>
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
        </div>
      </main>
    </div>
  )
}
