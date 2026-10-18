import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Users, Calendar, Inbox, ArrowUpRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { MetricCard, EmptyState, SegmentedControl, TrendChart, AnimatedCounter } from './arc/components'
import { ease } from './arc/motion'

type Go = (s: 'pipeline' | 'propiedades' | 'visitas' | 'facturas') => void

interface LeadRow { id: number; nombre: string; tipo: string; estado: string; created_at: string }
interface VisitaRow { id: number; nombre: string; propiedad_titulo: string; fecha: string; hora: string; estado: string }
interface InvRow { total: number | null; status: string; issued_at: string }

const DAY = 86400000
const eur = (n: number) => n.toLocaleString('es-ES', { maximumFractionDigits: 0 }) + ' €'
const TIPO: Record<string, string> = {
  valoracion: 'Valoración', contacto: 'Contacto', interes_propiedad: 'Interés propiedad', visita: 'Visita',
}

function pct(now: number, prev: number) {
  if (!prev) return now ? '+100%' : undefined
  const p = Math.round(((now - prev) / prev) * 100)
  return `${p >= 0 ? '+' : '−'}${Math.abs(p)}%`
}

function greeting() {
  const h = new Date().getHours()
  return h < 13 ? 'Buenos días' : h < 20 ? 'Buenas tardes' : 'Buenas noches'
}

export default function SectionInicio({ go }: { go: Go }) {
  const [leads, setLeads]       = useState<LeadRow[]>([])
  const [visitas, setVisitas]   = useState<VisitaRow[]>([])
  const [props, setProps]       = useState<{ publicado: boolean }[]>([])
  const [invoices, setInvoices] = useState<InvRow[]>([])
  const [ready, setReady]       = useState(false)
  const [now]                   = useState(() => Date.now())
  const [name, setName]         = useState('')

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    Promise.all([
      supabase.from('leads').select('id,nombre,tipo,estado,created_at').order('created_at', { ascending: false }),
      supabase.from('visitas').select('id,nombre,propiedad_titulo,fecha,hora,estado')
        .gte('fecha', today).in('estado', ['pendiente', 'confirmada']).order('fecha').order('hora'),
      supabase.from('propiedades').select('publicado'),
      supabase.from('invoices').select('total,status,issued_at'),
      supabase.auth.getUser().then(({ data }) => data.user
        ? supabase.from('profiles').select('full_name').eq('id', data.user.id).maybeSingle()
        : null),
    ]).then(([l, v, p, i, prof]) => {
      setName((prof?.data?.full_name as string | undefined)?.split(' ')[0] ?? '')
      setLeads((l.data ?? []) as LeadRow[])
      setVisitas((v.data ?? []) as VisitaRow[])
      setProps((p.data ?? []) as { publicado: boolean }[])
      setInvoices((i.data ?? []) as InvRow[])
      setReady(true)
    })
  }, [])

  // Leads por día (últimos 30) y comparación con los 30 anteriores
  const start = new Date(new Date(now).toDateString()).getTime() - 29 * DAY
  let last30 = 0, prev30 = 0
  for (const l of leads) {
    const t = new Date(l.created_at).getTime()
    if (t >= start) last30++
    else if (t >= start - 30 * DAY) prev30++
  }

  const nuevos = leads.filter(l => l.estado === 'nuevo').length
  const year = String(new Date().getFullYear())
  const vivas = invoices.filter(i => i.issued_at.startsWith(year) && i.status !== 'anulada' && i.status !== 'borrador')
  const facturado = vivas.reduce((s, i) => s + Number(i.total ?? 0), 0)
  const pendiente = vivas.filter(i => i.status === 'enviada' || i.status === 'vencida')
    .reduce((s, i) => s + Number(i.total ?? 0), 0)
  const publicadas = props.filter(p => p.publicado).length
  const semana = visitas.filter(v => new Date(v.fecha).getTime() < now + 7 * DAY).length

  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 10, filter: 'blur(4px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 0.4, ease: ease.enter, delay: 0.04 * i },
  })

  return (
    <div className="max-w-6xl">
      <div className="mb-7">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <h1 className="font-jakarta font-bold text-2xl mt-1" style={{ letterSpacing: '-0.02em' }}>{greeting()}{name ? `, ${name}` : ''}</h1>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <motion.div {...stagger(0)}>
          <MetricCard label="Leads sin atender" value={ready ? nuevos : 0}
            context={`${last30} leads en los últimos 30 días`} change={ready ? pct(last30, prev30) : undefined}
            onClick={() => go('pipeline')} />
        </motion.div>
        <motion.div {...stagger(1)}>
          <MetricCard label="Visitas próximas" value={ready ? visitas.length : 0}
            context={`${semana} en los próximos 7 días`} onClick={() => go('visitas')} />
        </motion.div>
        <motion.div {...stagger(2)}>
          <MetricCard label="Propiedades publicadas" value={ready ? publicadas : 0}
            context={`${props.length - publicadas} en borrador`} onClick={() => go('propiedades')} />
        </motion.div>
        <motion.div {...stagger(3)}>
          <MetricCard label={`Facturado ${year}`} value={ready ? Math.round(facturado) : 0} suffix="€"
            context={`${eur(pendiente)} pendiente de cobro`} onClick={() => go('facturas')} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-4">
        <motion.section {...stagger(4)} className="arc-card p-5 lg:col-span-3">
          <LeadsTrend leads={leads} now={now} />
        </motion.section>

        <motion.section {...stagger(5)} className="arc-card p-2 lg:col-span-2">
          <Header title="Próximas visitas" onMore={() => go('visitas')} />
          {ready && visitas.length === 0
            ? <EmptyState icon={<Calendar size={18} />} title="Sin visitas programadas" />
            : visitas.slice(0, 5).map(v => (
              <button key={v.id} onClick={() => go('visitas')}
                className="arc-row w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left">
                <div className="w-10 shrink-0 text-center rounded-lg py-1" style={{ background: 'var(--surface-muted)' }}>
                  <p className="text-[10px] uppercase font-semibold" style={{ color: 'var(--gold)' }}>
                    {new Date(v.fecha).toLocaleDateString('es-ES', { month: 'short' })}
                  </p>
                  <p className="text-sm font-bold leading-none tabular">{new Date(v.fecha).getDate()}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{v.nombre}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{v.hora?.slice(0, 5)} · {v.propiedad_titulo}</p>
                </div>
              </button>
            ))}
        </motion.section>
      </div>

      <motion.section {...stagger(6)} className="arc-card p-2 mt-4">
        <Header title="Últimos leads" onMore={() => go('pipeline')} />
        {ready && leads.length === 0
          ? <EmptyState icon={<Inbox size={18} />} title="Aún no hay leads" />
          : leads.slice(0, 6).map(l => (
            <button key={l.id} onClick={() => go('pipeline')}
              className="arc-row w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left">
              <div className="w-8 h-8 shrink-0 rounded-full grid place-items-center text-xs font-bold"
                style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}>
                {l.nombre?.trim()?.[0]?.toUpperCase() ?? <Users size={14} />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{l.nombre}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{TIPO[l.tipo] ?? l.tipo}</p>
              </div>
              {l.estado === 'nuevo' && <span className="arc-pill"
                style={{ background: 'color-mix(in oklch, var(--gold) 14%, transparent)', color: '#9A7424' }}>Nuevo</span>}
              <span className="text-xs tabular shrink-0" style={{ color: 'var(--text-muted)' }}>
                {new Date(l.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
              </span>
            </button>
          ))}
      </motion.section>
    </div>
  )
}

function Header({ title, onMore }: { title: string; onMore: () => void }) {
  return (
    <div className="flex items-center justify-between px-3 pt-3 pb-2">
      <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{title}</p>
      <button onClick={onMore} className="flex items-center gap-1 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
        Ver todo <ArrowUpRight size={13} />
      </button>
    </div>
  )
}

// ── Tendencia de leads: periodo actual vs anterior ────────────────────────────
type Period = '7' | '30' | '90'
const PERIODS: { value: Period; label: string }[] = [
  { value: '7', label: '7 días' }, { value: '30', label: '30 días' }, { value: '90', label: '90 días' },
]

function LeadsTrend({ leads, now }: { leads: LeadRow[]; now: number }) {
  const [period, setPeriod] = useState<Period>('30')
  const days = Number(period)
  const bucket = days === 90 ? 3 : 1                 // 90 días → tramos de 3 días
  const n = days / bucket
  const end = new Date(new Date(now).toDateString()).getTime() + DAY   // fin de hoy
  const start = end - days * DAY
  const cur = Array.from({ length: n }, () => 0)
  const prev = Array.from({ length: n }, () => 0)
  for (const l of leads) {
    const t = new Date(l.created_at).getTime()
    if (t >= start && t < end) cur[Math.floor((t - start) / (bucket * DAY))]++
    else if (t >= start - days * DAY && t < start) prev[Math.floor((t - start + days * DAY) / (bucket * DAY))]++
  }
  const labels = cur.map((_, i) =>
    new Date(start + i * bucket * DAY).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }))
  const total = cur.reduce((a, b) => a + b, 0)
  const prevTotal = prev.reduce((a, b) => a + b, 0)
  const change = prevTotal ? ((total - prevTotal) / prevTotal) * 100 : null
  const tone = change == null || change === 0 ? 'var(--text-muted)' : change > 0 ? 'var(--success)' : 'var(--danger)'

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <p className="font-jakarta font-semibold text-base">Leads entrantes</p>
        <SegmentedControl id="leads-period" options={PERIODS} value={period} onChange={setPeriod} />
      </div>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total leads</p>
      <AnimatedCounter value={total} className="font-jakarta font-semibold text-[2.4rem] mt-1" />
      <p className="text-sm mt-1.5 tabular" style={{ color: tone }}>
        {change == null
          ? `Sin datos de los ${days} días anteriores`
          : `${change >= 0 ? '+' : '−'}${Math.abs(change).toLocaleString('es-ES', { maximumFractionDigits: 1 })}% vs ${days} días anteriores`}
      </p>
      <div className="flex gap-5 mt-5 mb-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
        <span className="flex items-center gap-2"><span className="w-3.5 h-[2.5px] rounded" style={{ background: 'var(--accent)' }} />Este periodo</span>
        <span className="flex items-center gap-2"><span className="w-3.5 h-[2.5px]"
          style={{ background: 'repeating-linear-gradient(to right, var(--text-muted) 0 4px, transparent 4px 7px)' }} />Periodo anterior</span>
      </div>
      <TrendChart current={cur} previous={prev} labels={labels} height={200}
        format={v => `${v} lead${v === 1 ? '' : 's'}`} />
    </div>
  )
}
