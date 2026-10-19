import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Phone, Mail, MessageCircle, Plus, Search, Building2, Loader2, Inbox, Check } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { SegmentedControl, EmptyState } from './arc/components'
import { Sheet } from './arc/overlays'
import { spring } from './arc/motion'
import {
  type Lead, type Notify, LEAD_ESTADOS, ESTADO_LABEL, ESTADO_TONE, TIPO_LABEL, waLink, timeAgo,
} from './crm'

// Columnas del tablero (descartados solo en la lista)
const BOARD: Lead['estado'][] = ['nuevo', 'contactado', 'en_proceso', 'cerrado']

// ── Fila de lead (lista y tablero) ────────────────────────────────────────────
export function LeadRow({ lead, onOpen, compact = false }: { lead: Lead; onOpen: () => void; compact?: boolean }) {
  const t = ESTADO_TONE[lead.estado]
  return (
    <div className="arc-row flex items-center gap-3 px-3 py-2.5 rounded-xl">
      <button onClick={onOpen} className="flex items-center gap-3 flex-1 min-w-0 text-left">
        <div className="w-9 h-9 shrink-0 rounded-full grid place-items-center text-sm font-bold"
          style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}>
          {lead.nombre?.trim()?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{lead.nombre}</p>
          <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
            {TIPO_LABEL[lead.tipo] ?? lead.tipo}{lead.propiedad_ref ? ` · ${lead.propiedad_ref}` : ''} · {timeAgo(lead.created_at)}
          </p>
        </div>
        {!compact && <span className="hidden sm:inline"><span className="arc-pill" style={{ background: t.bg, color: t.text }}>{ESTADO_LABEL[lead.estado]}</span></span>}
      </button>
      {/* Acciones de un toque */}
      {lead.telefono && (
        <a href={`tel:${lead.telefono}`} className="p-2 rounded-full shrink-0" style={{ color: 'var(--text-secondary)' }} title="Llamar">
          <Phone size={16} />
        </a>
      )}
      {lead.telefono && !compact && (
        <a href={waLink(lead.telefono)} target="_blank" rel="noreferrer" className="p-2 -ml-2 rounded-full shrink-0"
          style={{ color: 'oklch(55% 0.15 150)' }} title="WhatsApp">
          <MessageCircle size={16} />
        </a>
      )}
    </div>
  )
}

// ── Ficha del lead (hoja) ─────────────────────────────────────────────────────
export function LeadSheet({ lead, onClose, onUpdate, notify }: {
  lead: Lead | null; onClose: () => void; onUpdate: (id: number, c: Partial<Lead>) => void; notify: Notify
}) {
  const [notas, setNotas] = useState(lead?.notas ?? '')
  const [saved, setSaved] = useState(true)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  if (!lead) return <Sheet open={false} onClose={onClose} title="">{null}</Sheet>

  const patch = async (c: Partial<Lead>) => {
    onUpdate(lead.id, c)
    const { error } = await supabase.from('leads').update(c).eq('id', lead.id)
    if (error) notify('Error: ' + error.message, false)
  }
  // Notas: se guardan solas al dejar de escribir
  const onNotas = (v: string) => {
    setNotas(v); setSaved(false)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(async () => { await patch({ notas: v }); setSaved(true) }, 700)
  }

  const first = lead.nombre.split(' ')[0]
  const actions = [
    lead.telefono && { href: `tel:${lead.telefono}`, icon: Phone, label: 'Llamar' },
    lead.telefono && { href: waLink(lead.telefono, `Hola ${first}, soy Joaquín de qimmo. `), icon: MessageCircle, label: 'WhatsApp', ext: true },
    lead.email && { href: `mailto:${lead.email}`, icon: Mail, label: 'Email' },
  ].filter(Boolean) as { href: string; icon: typeof Phone; label: string; ext?: boolean }[]

  return (
    <Sheet open onClose={onClose} title={
      <div>
        <p className="font-jakarta font-bold text-lg truncate">{lead.nombre}</p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {TIPO_LABEL[lead.tipo] ?? lead.tipo} · {new Date(lead.created_at).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    }>
      <div className="grid gap-2 mb-5" style={{ gridTemplateColumns: `repeat(${actions.length || 1}, 1fr)` }}>
        {actions.map(a => (
          <motion.a key={a.label} href={a.href} target={a.ext ? '_blank' : undefined} rel="noreferrer"
            whileTap={{ scale: 0.95 }} transition={spring.snappy}
            className="flex flex-col items-center gap-1.5 py-3 rounded-2xl text-xs font-medium"
            style={{ background: 'var(--surface-muted)', color: 'var(--foreground)' }}>
            <a.icon size={19} style={{ color: a.label === 'WhatsApp' ? 'oklch(55% 0.15 150)' : 'var(--accent)' }} />
            {a.label}
          </motion.a>
        ))}
      </div>

      <div className="space-y-1.5 text-sm mb-5">
        {lead.telefono && <p className="flex items-center gap-2"><Phone size={14} style={{ color: 'var(--text-muted)' }} />{lead.telefono}</p>}
        {lead.email && <p className="flex items-center gap-2 break-all"><Mail size={14} style={{ color: 'var(--text-muted)' }} />{lead.email}</p>}
        {lead.propiedad_ref && <p className="flex items-center gap-2"><Building2 size={14} style={{ color: 'var(--gold)' }} />Ref. {lead.propiedad_ref}</p>}
      </div>

      {lead.mensaje && (
        <div className="rounded-2xl p-3.5 mb-5 text-sm leading-relaxed" style={{ background: 'var(--surface-muted)', color: 'var(--text-secondary)' }}>
          {lead.mensaje}
        </div>
      )}

      <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Estado</p>
      <div className="flex flex-wrap gap-1.5 mb-5">
        {LEAD_ESTADOS.map(e => {
          const t = ESTADO_TONE[e], on = lead.estado === e
          return (
            <motion.button key={e} whileTap={{ scale: 0.95 }} onClick={() => patch({ estado: e })}
              className="px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: on ? t.bg : 'transparent', color: on ? t.text : 'var(--text-muted)',
                border: `1px solid ${on ? 'transparent' : 'var(--border)'}` }}>
              {ESTADO_LABEL[e]}
            </motion.button>
          )
        })}
      </div>

      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Notas internas</p>
        <span className="text-[11px] flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
          {saved ? <><Check size={11} /> Guardado</> : 'Guardando…'}
        </span>
      </div>
      <textarea className="input w-full resize-none text-sm" rows={4} placeholder="Qué busca, presupuesto, próximos pasos…"
        value={notas} onChange={e => onNotas(e.target.value)} />
    </Sheet>
  )
}

// ── Alta manual de lead ───────────────────────────────────────────────────────
function NuevoLead({ open, onClose, onCreated, notify }: {
  open: boolean; onClose: () => void; onCreated: (l: Lead) => void; notify: Notify
}) {
  const empty = { nombre: '', telefono: '', email: '', tipo: 'contacto' as Lead['tipo'], propiedad_ref: '', mensaje: '' }
  const [f, setF] = useState(empty)
  const [saving, setSaving] = useState(false)
  const save = async () => {
    if (!f.nombre.trim() || (!f.telefono.trim() && !f.email.trim())) { notify('Nombre y teléfono o email', false); return }
    setSaving(true)
    const { data, error } = await supabase.from('leads').insert({
      nombre: f.nombre.trim(), telefono: f.telefono.trim(), email: f.email.trim(), tipo: f.tipo,
      propiedad_ref: f.propiedad_ref.trim() || null, mensaje: f.mensaje.trim() || null, estado: 'nuevo',
    }).select().single()
    setSaving(false)
    if (error) { notify('Error: ' + error.message, false); return }
    onCreated(data as Lead); setF(empty)
  }
  const L = (label: string, node: React.ReactNode) => (
    <label className="block"><span className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>{label}</span>{node}</label>
  )
  return (
    <Sheet open={open} onClose={onClose} title={<p className="font-jakarta font-bold text-lg">Nuevo lead</p>}
      footer={<><div className="flex-1" /><button onClick={onClose} className="btn-outline">Cancelar</button>
        <button onClick={save} disabled={saving} className="btn-primary">{saving && <Loader2 size={15} className="animate-spin" />} Crear lead</button></>}>
      <div className="space-y-4">
        {L('Nombre', <input className="input w-full" value={f.nombre} onChange={e => setF({ ...f, nombre: e.target.value })} autoFocus />)}
        <div className="grid grid-cols-2 gap-3">
          {L('Teléfono', <input type="tel" className="input w-full" value={f.telefono} onChange={e => setF({ ...f, telefono: e.target.value })} />)}
          {L('Email', <input type="email" className="input w-full" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />)}
          {L('Tipo', (
            <select className="input w-full" value={f.tipo} onChange={e => setF({ ...f, tipo: e.target.value as Lead['tipo'] })}>
              {Object.entries(TIPO_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          ))}
          {L('Ref. propiedad', <input className="input w-full" value={f.propiedad_ref} onChange={e => setF({ ...f, propiedad_ref: e.target.value })} placeholder="Opcional" />)}
        </div>
        {L('Mensaje / origen', <textarea className="input w-full resize-none" rows={3} value={f.mensaje}
          onChange={e => setF({ ...f, mensaje: e.target.value })} placeholder="Idealista, llamada, referido…" />)}
      </div>
    </Sheet>
  )
}

// ── Sección ───────────────────────────────────────────────────────────────────
export default function SectionPipeline({ notify }: { notify: Notify }) {
  const [leads, setLeads]     = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState<Lead['estado'] | 'todos'>('todos')
  const [q, setQ]             = useState('')
  const [openId, setOpenId]   = useState<number | null>(null)
  const [creating, setCreating] = useState(false)
  const [view, setView]       = useState<'lista' | 'tablero'>('lista')

  useEffect(() => {
    supabase.from('leads').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) notify(error.message, false)
        setLeads((data ?? []) as Lead[])
        setLoading(false)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const update = (id: number, c: Partial<Lead>) => setLeads(ls => ls.map(l => l.id === id ? { ...l, ...c } : l))
  const needle = q.trim().toLowerCase()
  const matches = (l: Lead) => !needle || `${l.nombre} ${l.telefono} ${l.email} ${l.propiedad_ref ?? ''}`.toLowerCase().includes(needle)
  const filtered = leads.filter(l => (filter === 'todos' || l.estado === filter) && matches(l))
  const count = (e: Lead['estado']) => leads.filter(l => l.estado === e).length
  const open = leads.find(l => l.id === openId) ?? null

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="font-jakarta font-bold text-2xl">Pipeline</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{leads.length} leads · {count('nuevo')} sin atender</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <SegmentedControl id="pipe-view" value={view} onChange={setView}
              options={[{ value: 'lista', label: 'Lista' }, { value: 'tablero', label: 'Tablero' }]} />
          </div>
          <button onClick={() => setCreating(true)} className="btn-primary"><Plus size={16} /><span className="hidden sm:inline">Nuevo lead</span></button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {view === 'lista' && (
          <div className="overflow-x-auto -mx-1 px-1">
            <SegmentedControl id="pipe-filter" value={filter} onChange={setFilter} options={[
              { value: 'todos', label: `Todos · ${leads.length}` },
              ...LEAD_ESTADOS.map(e => ({ value: e, label: `${ESTADO_LABEL[e]} · ${count(e)}` })),
            ]} />
          </div>
        )}
        <label className="flex items-center gap-2 px-3 h-10 rounded-[var(--radius-control)] sm:ml-auto sm:w-64"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <Search size={15} style={{ color: 'var(--text-muted)' }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Nombre, teléfono, ref…"
            className="flex-1 min-w-0 bg-transparent outline-none text-sm" />
        </label>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin" style={{ color: 'var(--text-muted)' }} /></div>
      ) : view === 'tablero' ? (
        <div className="grid grid-cols-4 gap-3 items-start">
          {BOARD.map(e => {
            const items = leads.filter(l => l.estado === e && matches(l))
            const t = ESTADO_TONE[e]
            return (
              <section key={e} className="rounded-[var(--radius-panel)] p-2" style={{ background: 'var(--surface-muted)' }}>
                <div className="flex items-center justify-between px-2 py-1.5">
                  <span className="arc-pill" style={{ background: t.bg, color: t.text }}>{ESTADO_LABEL[e]}</span>
                  <span className="text-xs tabular" style={{ color: 'var(--text-muted)' }}>{items.length}</span>
                </div>
                <div className="space-y-1.5 mt-1">
                  {items.map(l => (
                    <motion.div key={l.id} layout transition={spring.gentle} className="arc-card !rounded-xl p-0.5">
                      <LeadRow lead={l} compact onOpen={() => setOpenId(l.id)} />
                    </motion.div>
                  ))}
                  {items.length === 0 && <p className="text-xs text-center py-6" style={{ color: 'var(--text-muted)' }}>Vacío</p>}
                </div>
              </section>
            )
          })}
        </div>
      ) : filtered.length === 0 ? (
        <div className="arc-card"><EmptyState icon={<Inbox size={18} />} title="Sin leads" text={needle ? 'Prueba con otra búsqueda' : undefined} /></div>
      ) : (
        <div className="arc-card p-2">
          {filtered.map(l => (
            <motion.div key={l.id} layout transition={spring.gentle}>
              <LeadRow lead={l} onOpen={() => setOpenId(l.id)} />
            </motion.div>
          ))}
        </div>
      )}

      <LeadSheet key={openId ?? 'none'} lead={open} onClose={() => setOpenId(null)} onUpdate={update} notify={notify} />
      <NuevoLead open={creating} onClose={() => setCreating(false)} notify={notify}
        onCreated={l => { setLeads(ls => [l, ...ls]); setCreating(false); setOpenId(l.id); notify('Lead creado') }} />
    </div>
  )
}
