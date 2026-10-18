import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, X, Loader2, Search, Repeat, AlertTriangle, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { MetricCard, SegmentedControl, EmptyState } from './arc/components'
import { spring } from './arc/motion'
import { eur0, isBilled } from './arc/periods'

// ── Types ─────────────────────────────────────────────────────────────────────
export interface Gasto {
  id: number
  fecha: string
  clasificacion: string
  concepto: string
  base: number | null
  iva: number | null
  total: number | null
  estado: string
  consolidado: boolean
  recurrente: boolean
  periodicidad: string | null
  proveedor: string | null
  nif_proveedor: string | null
  num_factura: string | null
  drive_ref: string | null
  pagado_quim: string | null
}
interface Ingreso { issued_at: string; subtotal: number; status: string; vertical: string | null }

type Notify = (m: string, ok?: boolean) => void

const ESTADOS = ['Contabilizado', 'Incidencia', 'Previsto', 'Pendiente de factura']
const ESTADO_STYLE: Record<string, { bg: string; fg: string }> = {
  Contabilizado:          { bg: 'color-mix(in oklch, var(--success) 11%, transparent)', fg: 'var(--success)' },
  Incidencia:             { bg: 'color-mix(in oklch, var(--danger) 11%, transparent)',  fg: 'var(--danger)' },
  Previsto:               { bg: 'var(--surface-muted)', fg: 'var(--text-secondary)' },
  'Pendiente de factura': { bg: 'color-mix(in oklch, var(--warning) 14%, transparent)', fg: 'oklch(50% 0.13 70)' },
}

const eur2 = (n: number) =>
  n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: 'always' }) + ' €'
const monthKey = (d: string) => d.slice(0, 7)
const monthName = (k: string, short = false) => {
  const s = new Date(`${k}-01T12:00:00`).toLocaleDateString('es-ES', short ? { month: 'short' } : { month: 'long', year: 'numeric' })
  return s.charAt(0).toUpperCase() + s.slice(1)
}
// Lo que cuenta en el P&L (misma regla que el Excel): base de los consolidados
const pnlBase = (g: Gasto) => (g.consolidado ? Number(g.base ?? 0) : 0)

// ── Sección ───────────────────────────────────────────────────────────────────
export default function SectionFinanzas({ notify }: { notify: Notify }) {
  const [tab, setTab]           = useState<'resultado' | 'gastos'>('resultado')
  const [gastos, setGastos]     = useState<Gasto[]>([])
  const [ingresos, setIngresos] = useState<Ingreso[]>([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState<Gasto | 'new' | null>(null)

  useEffect(() => {
    Promise.all([
      supabase.from('gastos').select('*').order('fecha', { ascending: false }),
      supabase.from('invoices').select('issued_at,subtotal,status,vertical').eq('accounting', 'A'),
    ]).then(([g, i]) => {
      if (g.error) notify('Error cargando gastos: ' + g.error.message, false)
      setGastos((g.data ?? []) as Gasto[])
      setIngresos(((i.data ?? []) as Ingreso[]).filter(x => isBilled(x.status)))
      setLoading(false)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onSaved = (g: Gasto) => {
    setGastos(gs => [g, ...gs.filter(x => x.id !== g.id)].sort((a, b) => b.fecha.localeCompare(a.fecha)))
    setModal(null)
    notify('Gasto guardado')
  }
  const onDeleted = (id: number) => {
    setGastos(gs => gs.filter(x => x.id !== id))
    setModal(null)
    notify('Gasto eliminado')
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between gap-3 mb-5">
        <h1 className="font-jakarta font-bold text-2xl">Finanzas</h1>
        <button onClick={() => setModal('new')} className="btn-primary"><Plus size={16} /> <span className="hidden sm:inline">Nuevo gasto</span></button>
      </div>
      <div className="mb-5">
        <SegmentedControl id="fin-tab" value={tab} onChange={setTab}
          options={[{ value: 'resultado', label: 'Resultado' }, { value: 'gastos', label: `Gastos · ${gastos.length}` }]} />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin" style={{ color: 'var(--text-muted)' }} /></div>
      ) : tab === 'resultado'
        ? <Resultado gastos={gastos} ingresos={ingresos} />
        : <ListaGastos gastos={gastos} onOpen={setModal} />}

      <AnimatePresence>
        {modal && (
          <GastoForm initial={modal === 'new' ? null : modal} gastos={gastos}
            onClose={() => setModal(null)} onSaved={onSaved} onDeleted={onDeleted} notify={notify} />
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Resultado (P&L mensual) ───────────────────────────────────────────────────
function Resultado({ gastos, ingresos }: { gastos: Gasto[]; ingresos: Ingreso[] }) {
  const [now] = useState(() => new Date())
  const year = String(now.getFullYear())
  const thisMonth = `${year}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const rows = useMemo(() => {
    const keys = new Set<string>()
    gastos.forEach(g => g.fecha.startsWith(year) && keys.add(monthKey(g.fecha)))
    ingresos.forEach(i => i.issued_at.startsWith(year) && keys.add(monthKey(i.issued_at)))
    return [...keys].sort().map(k => {
      const ing = ingresos.filter(i => monthKey(i.issued_at) === k).reduce((s, i) => s + Number(i.subtotal), 0)
      const gs = gastos.filter(g => monthKey(g.fecha) === k)
      const gas = gs.reduce((s, g) => s + pnlBase(g), 0)
      const fijos = gs.filter(g => g.recurrente).reduce((s, g) => s + pnlBase(g), 0)
      return { k, ing, gas, fijos, res: ing - gas, futuro: k > thisMonth }
    })
  }, [gastos, ingresos, year, thisMonth])

  const real = rows.filter(r => !r.futuro)
  const ing = real.reduce((s, r) => s + r.ing, 0)
  const gas = real.reduce((s, r) => s + r.gas, 0)
  const res = ing - gas
  const max = Math.max(...rows.map(r => Math.max(r.ing, r.gas)), 1)

  const porVertical = Object.entries(ingresos.filter(i => i.issued_at.startsWith(year))
    .reduce<Record<string, number>>((o, i) => { const v = i.vertical ?? 'Otros'; o[v] = (o[v] ?? 0) + Number(i.subtotal); return o }, {}))
    .sort((a, b) => b[1] - a[1])
  const totalVert = porVertical.reduce((s, [, v]) => s + v, 0) || 1

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard label="Ingresos" value={Math.round(ing)} suffix="€" context="Base imponible, hasta hoy" />
        <MetricCard label="Gastos" value={Math.round(gas)} suffix="€" context="Consolidados, hasta hoy" />
        <MetricCard label="Resultado (BAI)" value={Math.round(res)} suffix="€"
          change={ing ? `${res >= 0 ? '+' : '−'}${Math.abs(Math.round(res / ing * 100))}%` : undefined}
          context="Margen sobre ingresos" />
        <MetricCard label="Gastos fijos / mes" value={Math.round(rows.filter(r => r.futuro).at(0)?.fijos ?? real.at(-1)?.fijos ?? 0)} suffix="€"
          context="Recurrentes previstos" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="arc-glow lg:col-span-3"><div className="arc-card p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="font-jakarta font-semibold text-base">Ingresos vs gastos {year}</p>
          </div>
          <div className="flex gap-5 mb-5 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'var(--accent)' }} />Ingresos</span>
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'var(--gold)' }} />Gastos</span>
          </div>
          <div className="flex items-end gap-2 sm:gap-4 h-48">
            {rows.map((r, i) => (
              <div key={r.k} className="flex-1 h-full flex flex-col justify-end items-center gap-1.5">
                <div className="w-full flex-1 flex items-end justify-center gap-1" style={{ opacity: r.futuro ? 0.45 : 1 }}>
                  {[[r.ing, 'var(--accent)'], [r.gas, 'var(--gold)']].map(([v, c], j) => (
                    <motion.div key={j} className="w-full max-w-[22px] rounded-t-md"
                      initial={{ height: 0 }} animate={{ height: `${(Number(v) / max) * 100}%` }}
                      transition={{ ...spring.gentle, delay: i * 0.04 + j * 0.02 }}
                      style={{ background: c as string, minHeight: Number(v) ? 3 : 0 }}
                      title={`${monthName(r.k)} · ${j ? 'Gastos' : 'Ingresos'}: ${eur2(Number(v))}`} />
                  ))}
                </div>
                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{monthName(r.k, true)}</span>
              </div>
            ))}
          </div>
        </div></div>

        <div className="arc-card p-5 lg:col-span-2">
          <p className="font-jakarta font-semibold text-base mb-4">Ingresos por vertical</p>
          <div className="space-y-3.5">
            {porVertical.map(([v, n], i) => (
              <div key={v}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span>{v}</span><span className="font-semibold tabular">{eur0(n)}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-muted)' }}>
                  <motion.div className="h-full rounded-full" style={{ background: 'var(--accent)' }}
                    initial={{ width: 0 }} animate={{ width: `${(n / totalVert) * 100}%` }}
                    transition={{ ...spring.gentle, delay: i * 0.05 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* P&L mensual: tabla en escritorio, tarjetas en móvil */}
      <div className="arc-card overflow-hidden">
        <table className="hidden md:table w-full text-sm">
          <thead>
            <tr className="text-left text-xs" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
              <th className="px-5 py-3 font-medium">Mes</th>
              <th className="px-5 py-3 font-medium text-right">Ingresos</th>
              <th className="px-5 py-3 font-medium text-right">Gastos</th>
              <th className="px-5 py-3 font-medium text-right">Fijos</th>
              <th className="px-5 py-3 font-medium text-right">Resultado</th>
              <th className="px-5 py-3 font-medium text-right">Margen</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.k} style={{ borderBottom: '1px solid var(--border-subtle)', opacity: r.futuro ? 0.55 : 1 }}>
                <td className="px-5 py-3 font-medium">{monthName(r.k)}{r.futuro && <span className="ml-2 text-xs" style={{ color: 'var(--text-muted)' }}>previsto</span>}</td>
                <td className="px-5 py-3 text-right tabular">{eur2(r.ing)}</td>
                <td className="px-5 py-3 text-right tabular">{eur2(r.gas)}</td>
                <td className="px-5 py-3 text-right tabular" style={{ color: 'var(--text-muted)' }}>{eur2(r.fijos)}</td>
                <td className="px-5 py-3 text-right tabular font-semibold" style={{ color: r.res >= 0 ? 'var(--success)' : 'var(--danger)' }}>{eur2(r.res)}</td>
                <td className="px-5 py-3 text-right tabular" style={{ color: 'var(--text-muted)' }}>{r.ing ? `${Math.round(r.res / r.ing * 100)}%` : '—'}</td>
              </tr>
            ))}
            <tr className="font-semibold" style={{ background: 'var(--surface-muted)' }}>
              <td className="px-5 py-3">Total hasta hoy</td>
              <td className="px-5 py-3 text-right tabular">{eur2(ing)}</td>
              <td className="px-5 py-3 text-right tabular">{eur2(gas)}</td>
              <td />
              <td className="px-5 py-3 text-right tabular" style={{ color: res >= 0 ? 'var(--success)' : 'var(--danger)' }}>{eur2(res)}</td>
              <td className="px-5 py-3 text-right tabular">{ing ? `${Math.round(res / ing * 100)}%` : '—'}</td>
            </tr>
          </tbody>
        </table>
        <div className="md:hidden divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
          {rows.map(r => (
            <div key={r.k} className="px-4 py-3 flex items-center gap-3" style={{ opacity: r.futuro ? 0.55 : 1 }}>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{monthName(r.k)}</p>
                <p className="text-xs tabular" style={{ color: 'var(--text-muted)' }}>+{eur0(r.ing)} · −{eur0(r.gas)}</p>
              </div>
              <span className="text-sm font-semibold tabular" style={{ color: r.res >= 0 ? 'var(--success)' : 'var(--danger)' }}>{eur0(r.res)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Lista de gastos ───────────────────────────────────────────────────────────
function ListaGastos({ gastos, onOpen }: { gastos: Gasto[]; onOpen: (g: Gasto) => void }) {
  const [filter, setFilter] = useState('todos')
  const [q, setQ] = useState('')
  const counts = (e: string) => gastos.filter(g => g.estado === e).length
  const filtered = gastos.filter(g =>
    (filter === 'todos' || g.estado === filter) &&
    (!q || `${g.concepto} ${g.proveedor ?? ''} ${g.clasificacion}`.toLowerCase().includes(q.toLowerCase())))
  const months = [...new Set(filtered.map(g => monthKey(g.fecha)))].sort().reverse()

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="overflow-x-auto -mx-1 px-1">
          <SegmentedControl id="gasto-filter" value={filter} onChange={setFilter} options={[
            { value: 'todos', label: 'Todos' },
            { value: 'Incidencia', label: `Incidencias · ${counts('Incidencia')}` },
            { value: 'Pendiente de factura', label: `Sin factura · ${counts('Pendiente de factura')}` },
            { value: 'Previsto', label: `Previstos · ${counts('Previsto')}` },
          ]} />
        </div>
        <label className="flex items-center gap-2 px-3 h-10 rounded-[var(--radius-control)] sm:ml-auto sm:w-64"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <Search size={15} style={{ color: 'var(--text-muted)' }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar concepto o proveedor"
            className="flex-1 min-w-0 bg-transparent outline-none text-sm" />
        </label>
      </div>

      {months.length === 0 && <div className="arc-card"><EmptyState icon={<Search size={18} />} title="Sin gastos" /></div>}
      <div className="space-y-4">
        {months.map(m => {
          const items = filtered.filter(g => monthKey(g.fecha) === m)
          return (
            <section key={m} className="arc-card p-2">
              <div className="flex items-baseline justify-between px-3 pt-2 pb-1.5">
                <p className="text-sm font-semibold">{monthName(m)}</p>
                <p className="text-xs tabular" style={{ color: 'var(--text-muted)' }}>
                  {eur2(items.reduce((s, g) => s + pnlBase(g), 0))} en P&L
                </p>
              </div>
              {items.map(g => {
                const st = ESTADO_STYLE[g.estado] ?? ESTADO_STYLE.Previsto
                return (
                  <button key={g.id} onClick={() => onOpen(g)}
                    className="arc-row w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left">
                    <div className="w-10 shrink-0 text-center">
                      <p className="text-sm font-bold leading-none tabular">{new Date(`${g.fecha}T12:00:00`).getDate()}</p>
                      <p className="text-[10px] uppercase" style={{ color: 'var(--text-muted)' }}>{monthName(m, true)}</p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate flex items-center gap-1.5">
                        {g.concepto}
                        {g.recurrente && <Repeat size={12} style={{ color: 'var(--text-muted)' }} />}
                        {!g.consolidado && <span className="text-[10px] font-normal" style={{ color: 'var(--text-muted)' }}>(fuera de P&L)</span>}
                      </p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{g.clasificacion}{g.proveedor ? ` · ${g.proveedor}` : ''}</p>
                    </div>
                    <span className="hidden sm:inline"><span className="arc-pill" style={{ background: st.bg, color: st.fg }}>{g.estado}</span></span>
                    {g.estado === 'Incidencia' && <AlertTriangle size={14} className="sm:hidden" style={{ color: 'var(--danger)' }} />}
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold tabular">{g.base != null ? eur2(Number(g.base)) : '—'}</p>
                      {g.total != null && <p className="text-[11px] tabular" style={{ color: 'var(--text-muted)' }}>{eur2(Number(g.total))} con IVA</p>}
                    </div>
                  </button>
                )
              })}
            </section>
          )
        })}
      </div>
    </div>
  )
}

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-2.5 text-sm">
      <span className="relative w-10 h-6 rounded-full transition-colors" style={{ background: on ? 'var(--accent)' : 'var(--border-strong)' }}>
        <motion.span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow" animate={{ left: on ? 18 : 2 }} transition={spring.snappy} />
      </span>
      {label}
    </button>
  )
}

// ── Formulario (hoja inferior en móvil, modal en escritorio) ─────────────────
function GastoForm({ initial, gastos, onClose, onSaved, onDeleted, notify }: {
  initial: Gasto | null; gastos: Gasto[]; onClose: () => void
  onSaved: (g: Gasto) => void; onDeleted: (id: number) => void; notify: Notify
}) {
  const [f, setF] = useState(() => ({
    fecha: initial?.fecha ?? new Date().toISOString().slice(0, 10),
    clasificacion: initial?.clasificacion ?? '',
    concepto: initial?.concepto ?? '',
    base: initial?.base != null ? String(initial.base).replace('.', ',') : '',
    ivaPct: initial?.base && initial?.iva != null ? String(Math.round(Number(initial.iva) / Number(initial.base) * 100)) : '21',
    estado: initial?.estado ?? 'Contabilizado',
    consolidado: initial?.consolidado ?? true,
    recurrente: initial?.recurrente ?? false,
    periodicidad: initial?.periodicidad ?? 'Mensual',
    proveedor: initial?.proveedor ?? '',
    nif_proveedor: initial?.nif_proveedor ?? '',
    num_factura: initial?.num_factura ?? '',
    drive_ref: initial?.drive_ref ?? '',
  }))
  const [saving, setSaving] = useState(false)
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF(x => ({ ...x, [k]: e.target.value }))

  // Acepta «1.234,56», «1234,56» y «1234.56»
  const num = (s: string) => s.includes(',') ? parseFloat(s.replace(/\./g, '').replace(',', '.')) : parseFloat(s)
  const base = num(f.base)
  // Si no se toca base ni IVA, respetamos los importes de la factura original
  const [touched, setTouched] = useState(false)
  const iva = !touched && initial ? initial.iva
    : isNaN(base) ? null : Math.round(base * (num(f.ivaPct) || 0)) / 100
  const total = !touched && initial ? initial.total
    : isNaN(base) || iva == null ? null : Math.round((base + iva) * 100) / 100
  const clasificaciones = [...new Set(gastos.map(g => g.clasificacion))].sort()
  const proveedores = [...new Set(gastos.map(g => g.proveedor).filter(Boolean))].sort() as string[]

  // Al elegir un proveedor conocido, rellena clasificación y NIF
  const pickProveedor = (p: string) => {
    const prev = gastos.find(g => g.proveedor === p)
    setF(x => ({ ...x, proveedor: p,
      clasificacion: x.clasificacion || prev?.clasificacion || '',
      nif_proveedor: x.nif_proveedor || prev?.nif_proveedor || '' }))
  }

  const save = async () => {
    if (!f.concepto.trim() || !f.clasificacion.trim() || isNaN(base)) {
      notify('Concepto, clasificación y base son obligatorios', false); return
    }
    setSaving(true)
    const payload = {
      fecha: f.fecha, clasificacion: f.clasificacion.trim(), concepto: f.concepto.trim(),
      base, iva, total, estado: f.estado, consolidado: f.consolidado, recurrente: f.recurrente,
      periodicidad: f.recurrente ? f.periodicidad : null,
      proveedor: f.proveedor.trim() || null, nif_proveedor: f.nif_proveedor.trim() || null,
      num_factura: f.num_factura.trim() || null, drive_ref: f.drive_ref.trim() || null,
    }
    const { data, error } = initial
      ? await supabase.from('gastos').update(payload).eq('id', initial.id).select().single()
      : await supabase.from('gastos').insert(payload).select().single()
    setSaving(false)
    if (error) { notify('Error: ' + error.message, false); return }
    onSaved(data as Gasto)
  }

  const remove = async () => {
    if (!initial || !confirm(`¿Eliminar «${initial.concepto}»?`)) return
    const { error } = await supabase.from('gastos').delete().eq('id', initial.id)
    if (error) { notify('Error: ' + error.message, false); return }
    onDeleted(initial.id)
  }

  const L = (label: string, node: React.ReactNode, cls = '') => (
    <label className={`block ${cls}`}>
      <span className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      {node}
    </label>
  )

  return (
    <motion.div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center sm:p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ background: 'color-mix(in oklch, #0D1F3C 30%, transparent)' }}
      onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <motion.div className="w-full sm:max-w-xl max-h-[92dvh] overflow-y-auto rounded-t-[1.75rem] sm:rounded-[var(--radius-surface)]"
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={spring.gentle}
        style={{ background: 'var(--surface)', boxShadow: 'var(--shadow-floating)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="sm:hidden flex justify-center pt-2.5"><span className="w-10 h-1 rounded-full" style={{ background: 'var(--border-strong)' }} /></div>
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <h2 className="font-jakarta font-bold text-lg">{initial ? 'Editar gasto' : 'Nuevo gasto'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg" style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
        </div>

        <div className="px-5 pb-4 space-y-4">
          {L('Concepto', <input className="input w-full" value={f.concepto} onChange={set('concepto')} placeholder="Gasolina, Idealista octubre…" autoFocus={!initial} />)}
          <div className="grid grid-cols-2 gap-3">
            {L('Fecha', <input type="date" className="input w-full" value={f.fecha} onChange={set('fecha')} />)}
            {L('Clasificación', <>
              <input className="input w-full" list="gasto-clasif" value={f.clasificacion} onChange={set('clasificacion')} />
              <datalist id="gasto-clasif">{clasificaciones.map(c => <option key={c} value={c} />)}</datalist>
            </>)}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {L('Base €', <input inputMode="decimal" className="input w-full" value={f.base} onChange={e => { setTouched(true); set('base')(e) }} placeholder="0,00" />)}
            {L('IVA %', <input inputMode="decimal" className="input w-full" value={f.ivaPct} onChange={e => { setTouched(true); set('ivaPct')(e) }} />)}
            {L('Total', <div className="input w-full tabular" style={{ background: 'var(--surface-muted)' }}>{total != null ? eur2(Number(total)) : '—'}</div>)}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {L('Proveedor', <>
              <input className="input w-full" list="gasto-prov" value={f.proveedor}
                onChange={e => pickProveedor(e.target.value)} />
              <datalist id="gasto-prov">{proveedores.map(p => <option key={p} value={p} />)}</datalist>
            </>)}
            {L('NIF proveedor', <input className="input w-full" value={f.nif_proveedor} onChange={set('nif_proveedor')} />)}
            {L('Nº factura', <input className="input w-full" value={f.num_factura} onChange={set('num_factura')} />)}
            {L('Estado', (
              <select className="input w-full" value={f.estado} onChange={set('estado')}>
                {ESTADOS.map(s => <option key={s}>{s}</option>)}
              </select>
            ))}
          </div>
          {L('Archivo en Drive', <input className="input w-full" value={f.drive_ref} onChange={set('drive_ref')} placeholder="PROVEEDOR_dd.mm.aaaa" />)}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
            <Toggle on={f.consolidado} onClick={() => setF(x => ({ ...x, consolidado: !x.consolidado }))} label="Cuenta en P&L" />
            <Toggle on={f.recurrente} onClick={() => setF(x => ({ ...x, recurrente: !x.recurrente }))} label="Recurrente" />
            {f.recurrente && (
              <select className="input py-1.5" value={f.periodicidad} onChange={set('periodicidad')}>
                {['Mensual', 'Trimestral', 'Anual'].map(p => <option key={p}>{p}</option>)}
              </select>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 flex items-center gap-3 px-5 py-4" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
          {initial && <button onClick={remove} className="p-2.5 rounded-xl" style={{ color: 'var(--danger)' }} title="Eliminar"><Trash2 size={17} /></button>}
          <div className="flex-1" />
          <button onClick={onClose} className="btn-outline">Cancelar</button>
          <button onClick={save} disabled={saving} className="btn-primary">
            {saving ? <Loader2 size={15} className="animate-spin" /> : null} Guardar
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
