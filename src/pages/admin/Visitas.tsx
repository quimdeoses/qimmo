import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Phone, MessageCircle, Mail, Plus, Loader2, Calendar, Clock, Check } from 'lucide-react'
import { supabase, type Propiedad } from '../../lib/supabase'
import { SegmentedControl, EmptyState } from './arc/components'
import { Sheet } from './arc/overlays'
import { spring } from './arc/motion'
import { type Visita, type Notify, VISITA_ESTADOS, ESTADO_LABEL, ESTADO_TONE, waLink } from './crm'

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

function dayLabel(fecha: string, today: string, tomorrow: string) {
  if (fecha === today) return 'Hoy'
  if (fecha === tomorrow) return 'Mañana'
  const s = new Date(`${fecha}T12:00:00`).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// ── Ficha de visita ───────────────────────────────────────────────────────────
function VisitaSheet({ v, onClose, onUpdate, notify }: {
  v: Visita; onClose: () => void; onUpdate: (id: number, c: Partial<Visita>) => void; notify: Notify
}) {
  const [notas, setNotas] = useState(v.notas ?? '')
  const patch = async (c: Partial<Visita>) => {
    onUpdate(v.id, c)
    const { error } = await supabase.from('visitas').update(c).eq('id', v.id)
    if (error) notify('Error: ' + error.message, false)
  }
  const fechaTxt = new Date(`${v.fecha}T12:00:00`).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
  const recordatorio = `Hola ${v.nombre.split(' ')[0]}, te recuerdo la visita a ${v.propiedad_titulo || v.propiedad_ref} el ${fechaTxt} a las ${v.hora.slice(0, 5)}. ¡Hasta pronto! — qimmo`
  const actions = [
    v.telefono && { href: `tel:${v.telefono}`, icon: Phone, label: 'Llamar' },
    v.telefono && { href: waLink(v.telefono, recordatorio), icon: MessageCircle, label: 'Recordar', ext: true },
    v.email && { href: `mailto:${v.email}?subject=${encodeURIComponent('Visita ' + (v.propiedad_titulo || v.propiedad_ref))}&body=${encodeURIComponent(recordatorio)}`, icon: Mail, label: 'Email' },
  ].filter(Boolean) as { href: string; icon: typeof Phone; label: string; ext?: boolean }[]

  return (
    <Sheet open onClose={onClose} title={
      <div>
        <p className="font-jakarta font-bold text-lg truncate">{v.nombre}</p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{fechaTxt} · {v.hora.slice(0, 5)}</p>
      </div>
    }>
      <div className="rounded-2xl p-3.5 mb-5" style={{ background: 'var(--surface-muted)' }}>
        <p className="text-xs" style={{ color: 'var(--gold)' }}>{v.propiedad_ref}</p>
        <p className="text-sm font-medium">{v.propiedad_titulo || '—'}</p>
      </div>
      <div className="grid gap-2 mb-5" style={{ gridTemplateColumns: `repeat(${actions.length || 1}, 1fr)` }}>
        {actions.map(a => (
          <motion.a key={a.label} href={a.href} target={a.ext ? '_blank' : undefined} rel="noreferrer"
            whileTap={{ scale: 0.95 }} transition={spring.snappy}
            className="flex flex-col items-center gap-1.5 py-3 rounded-2xl text-xs font-medium"
            style={{ background: 'var(--surface-muted)' }}>
            <a.icon size={19} style={{ color: a.icon === MessageCircle ? 'oklch(55% 0.15 150)' : 'var(--accent)' }} />
            {a.label}
          </motion.a>
        ))}
      </div>
      <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Estado</p>
      <div className="flex flex-wrap gap-1.5 mb-5">
        {VISITA_ESTADOS.map(e => {
          const t = ESTADO_TONE[e], on = v.estado === e
          return (
            <motion.button key={e} whileTap={{ scale: 0.95 }} onClick={() => patch({ estado: e })}
              className="px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: on ? t.bg : 'transparent', color: on ? t.text : 'var(--text-muted)', border: `1px solid ${on ? 'transparent' : 'var(--border)'}` }}>
              {ESTADO_LABEL[e]}
            </motion.button>
          )
        })}
      </div>
      <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Notas de la visita</p>
      <textarea className="input w-full resize-none text-sm" rows={3} value={notas} placeholder="Impresiones, objeciones, siguiente paso…"
        onChange={e => setNotas(e.target.value)} onBlur={() => notas !== (v.notas ?? '') && patch({ notas })} />
    </Sheet>
  )
}

// ── Alta de visita ────────────────────────────────────────────────────────────
function NuevaVisita({ open, onClose, onCreated, notify }: {
  open: boolean; onClose: () => void; onCreated: (v: Visita) => void; notify: Notify
}) {
  const [props, setProps] = useState<Pick<Propiedad, 'ref' | 'titulo'>[]>([])
  const [f, setF] = useState({ nombre: '', telefono: '', email: '', propiedad_ref: '', fecha: iso(new Date()), hora: '10:00' })
  const [saving, setSaving] = useState(false)
  useEffect(() => {
    if (open && !props.length) supabase.from('propiedades').select('ref,titulo').order('created_at', { ascending: false })
      .then(({ data }) => setProps(data ?? []))
  }, [open, props.length])

  const save = async () => {
    if (!f.nombre.trim() || !f.propiedad_ref) { notify('Nombre y propiedad son obligatorios', false); return }
    setSaving(true)
    const p = props.find(x => x.ref === f.propiedad_ref)
    const { data, error } = await supabase.from('visitas').insert({
      ...f, nombre: f.nombre.trim(), propiedad_titulo: p?.titulo ?? '', estado: 'confirmada',
    }).select().single()
    setSaving(false)
    if (error) { notify('Error: ' + error.message, false); return }
    onCreated(data as Visita)
  }
  const L = (label: string, node: React.ReactNode) => (
    <label className="block"><span className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>{label}</span>{node}</label>
  )
  return (
    <Sheet open={open} onClose={onClose} title={<p className="font-jakarta font-bold text-lg">Nueva visita</p>}
      footer={<><div className="flex-1" /><button onClick={onClose} className="btn-outline">Cancelar</button>
        <button onClick={save} disabled={saving} className="btn-primary">{saving && <Loader2 size={15} className="animate-spin" />} Agendar</button></>}>
      <div className="space-y-4">
        {L('Propiedad', (
          <select className="input w-full" value={f.propiedad_ref} onChange={e => setF({ ...f, propiedad_ref: e.target.value })}>
            <option value="">Elige propiedad…</option>
            {props.map(p => <option key={p.ref} value={p.ref}>{p.ref} · {p.titulo}</option>)}
          </select>
        ))}
        <div className="grid grid-cols-2 gap-3">
          {L('Fecha', <input type="date" className="input w-full" value={f.fecha} onChange={e => setF({ ...f, fecha: e.target.value })} />)}
          {L('Hora', <input type="time" className="input w-full" value={f.hora} onChange={e => setF({ ...f, hora: e.target.value })} />)}
        </div>
        {L('Nombre', <input className="input w-full" value={f.nombre} onChange={e => setF({ ...f, nombre: e.target.value })} />)}
        <div className="grid grid-cols-2 gap-3">
          {L('Teléfono', <input type="tel" className="input w-full" value={f.telefono} onChange={e => setF({ ...f, telefono: e.target.value })} />)}
          {L('Email', <input type="email" className="input w-full" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />)}
        </div>
      </div>
    </Sheet>
  )
}

// ── Sección ───────────────────────────────────────────────────────────────────
export default function SectionVisitas({ notify }: { notify: Notify }) {
  const [visitas, setVisitas] = useState<Visita[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab]         = useState<'proximas' | 'pasadas'>('proximas')
  const [openId, setOpenId]   = useState<number | null>(null)
  const [creating, setCreating] = useState(false)
  const [today] = useState(() => iso(new Date()))
  const [tomorrow] = useState(() => iso(new Date(Date.now() + 86400000)))

  useEffect(() => {
    supabase.from('visitas').select('*').order('fecha').order('hora')
      .then(({ data, error }) => {
        if (error) notify(error.message, false)
        setVisitas((data ?? []) as Visita[])
        setLoading(false)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const update = (id: number, c: Partial<Visita>) => setVisitas(vs => vs.map(v => v.id === id ? { ...v, ...c } : v))
  const proximas = visitas.filter(v => v.fecha >= today && v.estado !== 'cancelada')
  const pasadas = visitas.filter(v => v.fecha < today || v.estado === 'cancelada').reverse()
  const list = tab === 'proximas' ? proximas : pasadas
  const days = [...new Set(list.map(v => v.fecha))]
  const open = visitas.find(v => v.id === openId)

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="font-jakarta font-bold text-2xl">Visitas</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {proximas.filter(v => v.fecha === today).length} hoy · {proximas.length} próximas
          </p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary"><Plus size={16} /><span className="hidden sm:inline">Nueva visita</span></button>
      </div>
      <div className="mb-4">
        <SegmentedControl id="vis-tab" value={tab} onChange={setTab}
          options={[{ value: 'proximas', label: `Próximas · ${proximas.length}` }, { value: 'pasadas', label: `Pasadas · ${pasadas.length}` }]} />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin" style={{ color: 'var(--text-muted)' }} /></div>
      ) : list.length === 0 ? (
        <div className="arc-card"><EmptyState icon={<Calendar size={18} />} title={tab === 'proximas' ? 'Sin visitas programadas' : 'Sin visitas pasadas'}
          text={tab === 'proximas' ? 'Las solicitudes de la web y las que agendes aparecerán aquí' : undefined} /></div>
      ) : (
        <div className="space-y-4">
          {days.map(d => (
            <section key={d} className="arc-card p-2">
              <p className="px-3 pt-2 pb-1.5 text-sm font-semibold" style={{ color: d === today ? 'var(--gold)' : undefined }}>
                {dayLabel(d, today, tomorrow)}
              </p>
              {list.filter(v => v.fecha === d).map(v => {
                const t = ESTADO_TONE[v.estado]
                return (
                  <div key={v.id} className="arc-row flex items-center gap-3 px-3 py-2.5 rounded-xl">
                    <button onClick={() => setOpenId(v.id)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                      <span className="flex items-center gap-1 text-sm font-semibold tabular w-14 shrink-0">
                        <Clock size={13} style={{ color: 'var(--text-muted)' }} />{v.hora.slice(0, 5)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{v.nombre}</p>
                        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                          <span style={{ color: 'var(--gold)' }}>{v.propiedad_ref}</span>{v.propiedad_titulo ? ` · ${v.propiedad_titulo}` : ''}
                        </p>
                      </div>
                      <span className="arc-pill shrink-0" style={{ background: t.bg, color: t.text }}>
                        {v.estado === 'confirmada' && <Check size={10} />}{ESTADO_LABEL[v.estado]}
                      </span>
                    </button>
                    {v.telefono && <a href={`tel:${v.telefono}`} className="p-2 -mr-1 rounded-full" style={{ color: 'var(--text-secondary)' }}><Phone size={16} /></a>}
                  </div>
                )
              })}
            </section>
          ))}
        </div>
      )}

      {open && <VisitaSheet key={open.id} v={open} onClose={() => setOpenId(null)} onUpdate={update} notify={notify} />}
      <NuevaVisita open={creating} onClose={() => setCreating(false)} notify={notify}
        onCreated={v => { setVisitas(vs => [...vs, v].sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora))); setCreating(false); notify('Visita agendada') }} />
    </div>
  )
}
