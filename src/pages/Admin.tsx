import { useState, useEffect, useRef } from 'react'
import { supabase, type Propiedad, type TipoProp, type ZonaProp, type EnergiaCert, type BadgeProp } from '../lib/supabase'
import { Plus, Pencil, Trash2, Eye, EyeOff, X, CheckCircle, AlertCircle, LogOut, ImagePlus, Loader2 } from 'lucide-react'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'qimmo2025'
const SESSION_KEY    = 'qimmo_admin_auth'

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

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, ok, onClose }: { msg: string; ok: boolean; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className="fixed top-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl"
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
          <input type="password" placeholder="Contraseña" value={pwd}
            onChange={e => { setPwd(e.target.value); setErr(false) }}
            className="input w-full" autoFocus />
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
      <label className="block font-inter text-xs font-semibold text-navy mb-2">
        Fotos ({current.length})
      </label>
      <div className="flex flex-wrap gap-2">
        {current.map(url => (
          <div key={url} className="relative group w-20 h-20">
            <img src={url} alt="" className="w-20 h-20 object-cover rounded-lg" />
            <button type="button" onClick={() => remove(url)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <X size={10} />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => inputRef.current?.click()}
          disabled={loading || !propRef}
          className="w-20 h-20 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors"
          style={{ borderColor: '#E2E0DA', color: '#9CA3AF' }}
          title={!propRef ? 'Introduce primero la referencia' : 'Subir fotos'}>
          {loading ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
          {!loading && <span className="text-[9px] font-inter">Subir</span>}
        </button>
      </div>
      {!propRef && (
        <p className="font-inter text-[10px] mt-1" style={{ color: '#F59E0B' }}>
          Introduce la referencia antes de subir fotos
        </p>
      )}
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
        onChange={e => e.target.files && upload(e.target.files)} />
    </div>
  )
}

// ── Property form ─────────────────────────────────────────────────────────────
function PropForm({ initial, onSave, onCancel }: {
  initial: Propiedad | null
  onSave: () => void
  onCancel: () => void
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
      energia: initial.energia,
      lat: String(initial.lat), lng: String(initial.lng),
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
        {F('Referencia *', <input className="input w-full" placeholder="QIM-001" value={form.ref} onChange={set('ref')} />)}
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
        {F('Certificado energético', <select className="input w-full" value={form.energia} onChange={set('energia')}>{ENERGIAS.map(e => <option key={e}>{e}</option>)}</select>)}
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
      {F('Descripción', <textarea className="input w-full resize-none" rows={4} placeholder="Descripción del inmueble..." value={form.descripcion} onChange={set('descripcion')} />)}
      {F('Características (una por línea)', <textarea className="input w-full resize-none font-mono text-xs" rows={5} placeholder={'Suelos de parquet\nCocina equipada\nPuertas de roble'} value={form.caracteristicas} onChange={set('caracteristicas')} />)}
      <div className="grid grid-cols-2 gap-4">
        {F('Latitud', <input className="input w-full" placeholder="41.3874" value={form.lat} onChange={set('lat')} />)}
        {F('Longitud', <input className="input w-full" placeholder="2.1686" value={form.lng} onChange={set('lng')} />)}
      </div>

      <PhotoUploader propRef={form.ref} current={photos} onChange={setPhotos} />

      <div className="flex items-center gap-3 pt-2" style={{ borderTop: '1px solid #E2E0DA' }}>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.publicado} onChange={() => toggle('publicado')}
            className="w-4 h-4" style={{ accentColor: '#0D1F3C' }} />
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

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed]     = useState(() => sessionStorage.getItem(SESSION_KEY) === '1')
  const [props, setProps]       = useState<Propiedad[]>([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState<'new' | Propiedad | null>(null)
  const [toast, setToast]       = useState<{ msg: string; ok: boolean } | null>(null)

  const notify = (msg: string, ok = true) => setToast({ msg, ok })

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('propiedades').select('*').order('created_at', { ascending: false })
    setLoading(false)
    if (error) { notify(error.message, false); return }
    setProps((data ?? []) as Propiedad[])
  }

  useEffect(() => { if (authed) load() }, [authed])

  if (!authed) return <Login onLogin={() => setAuthed(true)} />

  const logout = () => { sessionStorage.removeItem(SESSION_KEY); setAuthed(false) }

  const togglePublicado = async (p: Propiedad) => {
    const { error } = await supabase.from('propiedades').update({ publicado: !p.publicado }).eq('id', p.id)
    if (error) { notify(error.message, false); return }
    setProps(ps => ps.map(x => x.id === p.id ? { ...x, publicado: !x.publicado } : x))
    notify(p.publicado ? 'Propiedad despublicada' : 'Propiedad publicada')
  }

  const eliminar = async (p: Propiedad) => {
    if (!confirm(`¿Eliminar "${p.titulo}"? Esta acción no se puede deshacer.`)) return
    const { error } = await supabase.from('propiedades').delete().eq('id', p.id)
    if (error) { notify(error.message, false); return }
    setProps(ps => ps.filter(x => x.id !== p.id))
    notify('Propiedad eliminada')
  }

  const handleSaved = () => {
    const isNew = modal === 'new'
    load()
    setModal(null)
    notify(isNew ? 'Propiedad creada' : 'Cambios guardados')
  }

  return (
    <div className="min-h-screen" style={{ background: '#F7F6F2' }}>
      {toast && <Toast msg={toast.msg} ok={toast.ok} onClose={() => setToast(null)} />}

      {/* Header */}
      <header className="bg-white sticky top-0 z-40" style={{ borderBottom: '1px solid #E2E0DA' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/LOGO QIMMO BLUE.png" alt="qimmo" className="h-10 w-auto" />
            <span className="font-inter text-xs font-semibold uppercase tracking-widest" style={{ color: '#C49A3C' }}>Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" className="font-inter text-sm" style={{ color: '#6B7280' }}>Ver web →</a>
            <button onClick={logout} className="flex items-center gap-1.5 font-inter text-sm" style={{ color: '#6B7280' }}>
              <LogOut size={14} /> Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total',      val: props.length },
            { label: 'Publicadas', val: props.filter(p => p.publicado).length },
            { label: 'Borradores', val: props.filter(p => !p.publicado).length },
          ].map(s => (
            <div key={s.label} className="card text-center">
              <p className="font-jakarta font-black text-3xl text-navy mb-1">{s.val}</p>
              <p className="font-inter text-xs" style={{ color: '#9CA3AF' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Table header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-jakarta font-bold text-navy text-xl">Propiedades</h1>
          <button onClick={() => setModal('new')} className="btn-primary gap-2">
            <Plus size={15} /> Nueva propiedad
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #E2E0DA' }}>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={24} className="animate-spin" style={{ color: '#C49A3C' }} />
            </div>
          ) : props.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-jakarta font-bold text-navy mb-2">Sin propiedades aún</p>
              <p className="font-inter text-sm" style={{ color: '#9CA3AF' }}>Crea tu primera con el botón de arriba</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E0DA', background: '#F7F6F2' }}>
                  {['Foto', 'Ref', 'Título', 'Tipo', 'Precio', 'Estado', 'Acciones'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-inter text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {props.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: i < props.length - 1 ? '1px solid #F0EDE8' : 'none' }}>
                    <td className="px-4 py-3">
                      {p.imagen
                        ? <img src={p.imagen} alt="" className="w-12 h-10 object-cover rounded-lg" />
                        : <div className="w-12 h-10 rounded-lg" style={{ background: '#F0F4FA' }} />}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-semibold" style={{ color: '#C49A3C' }}>{p.ref}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-inter text-sm font-semibold text-navy">{p.titulo}</p>
                      <p className="font-inter text-xs" style={{ color: '#9CA3AF' }}>{p.barrio}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-inter text-xs px-2 py-1 rounded-md" style={{ background: '#F0F4FA', color: '#0D1F3C' }}>{p.tipo}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-jakarta font-bold text-sm text-navy">{p.precio.toLocaleString('es-ES')} €</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => togglePublicado(p)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full font-inter text-xs font-semibold"
                        style={{
                          background: p.publicado ? '#ECFDF5' : '#FEF9EE',
                          color: p.publicado ? '#059669' : '#D97706',
                        }}>
                        {p.publicado ? <Eye size={11} /> : <EyeOff size={11} />}
                        {p.publicado ? 'Publicada' : 'Borrador'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setModal(p)} title="Editar"
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ color: '#6B7280' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#F0F4FA'; e.currentTarget.style.color = '#0D1F3C' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6B7280' }}>
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => eliminar(p)} title="Eliminar"
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ color: '#6B7280' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#DC2626' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6B7280' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Modal */}
      {modal !== null && (
        <div className="fixed inset-0 z-50 flex items-start justify-center py-8 px-4 overflow-y-auto"
          style={{ background: 'rgba(13,31,60,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl my-auto">
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #E2E0DA' }}>
              <h2 className="font-jakarta font-bold text-navy text-lg">
                {modal === 'new' ? 'Nueva propiedad' : `Editar — ${(modal as Propiedad).ref}`}
              </h2>
              <button onClick={() => setModal(null)} className="p-1.5 rounded-lg" style={{ color: '#6B7280' }}>
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-6 overflow-y-auto" style={{ maxHeight: '80vh' }}>
              <PropForm
                initial={modal === 'new' ? null : modal as Propiedad}
                onSave={handleSaved}
                onCancel={() => setModal(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
