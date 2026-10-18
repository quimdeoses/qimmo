import { useState } from 'react'
import { AnimatedCounter, SegmentedControl, TrendChart } from './components'

const DAY = 86400000

export interface PeriodOption { value: string; label: string; days: number }

// Tarjeta de tendencia: total del periodo, % vs periodo anterior y gráfica
// comparada. Con `cumulative` la línea muestra el acumulado (p. ej. facturado).
export default function PeriodTrend({
  title, totalLabel, points, periods, defaultPeriod, now, cumulative = false,
  format = String, decimals = 0, suffix, axisFormat, axisWidth,
}: {
  title: string
  totalLabel: string
  points: { t: number; v: number }[]
  periods: PeriodOption[]
  defaultPeriod: string
  now: number
  cumulative?: boolean
  format?: (n: number) => string
  decimals?: number
  suffix?: string
  axisFormat?: (n: number) => string
  axisWidth?: number
}) {
  const [period, setPeriod] = useState(defaultPeriod)
  const days = periods.find(p => p.value === period)?.days ?? 30
  const bucket = days <= 31 ? 1 : days <= 92 ? 3 : 7
  const n = Math.ceil(days / bucket)
  const end = new Date(new Date(now).toDateString()).getTime() + DAY   // fin de hoy
  const start = end - n * bucket * DAY
  const span = n * bucket * DAY

  const cur = Array.from({ length: n }, () => 0)
  const prev = Array.from({ length: n }, () => 0)
  for (const { t, v } of points) {
    if (t >= start && t < end) cur[Math.floor((t - start) / (bucket * DAY))] += v
    else if (t >= start - span && t < start) prev[Math.floor((t - start + span) / (bucket * DAY))] += v
  }
  const total = cur.reduce((a, b) => a + b, 0)
  const prevTotal = prev.reduce((a, b) => a + b, 0)
  const acc = (xs: number[]) => xs.reduce<number[]>((o, x) => [...o, (o.at(-1) ?? 0) + x], [])
  const series = cumulative ? acc(cur) : cur
  const prevSeries = cumulative ? acc(prev) : prev

  const labels = cur.map((_, i) => {
    const d = new Date(start + (i + 1) * bucket * DAY - DAY)
    return d.toLocaleDateString('es-ES', days > 92
      ? { day: 'numeric', month: 'short', year: '2-digit' }
      : { day: 'numeric', month: 'short' })
  })

  const change = prevTotal ? ((total - prevTotal) / prevTotal) * 100 : null
  const tone = change == null || change === 0 ? 'var(--text-muted)' : change > 0 ? 'var(--success)' : 'var(--danger)'
  const prevLabel = periods.find(p => p.value === period)?.label.toLowerCase()

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <p className="font-jakarta font-semibold text-base">{title}</p>
        <SegmentedControl id={`period-${title}`} options={periods} value={period} onChange={setPeriod} />
      </div>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{totalLabel}</p>
      <AnimatedCounter value={decimals ? total : Math.round(total)} decimals={decimals} suffix={suffix}
        className="font-jakarta font-semibold text-[2.4rem] mt-1" />
      <p className="text-sm mt-1.5 tabular" style={{ color: tone }}>
        {change == null
          ? `Sin datos de los ${prevLabel} anteriores`
          : `${change >= 0 ? '+' : '−'}${Math.abs(change).toLocaleString('es-ES', { maximumFractionDigits: 1 })}% vs ${prevLabel} anteriores`}
      </p>
      <div className="flex gap-5 mt-5 mb-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
        <span className="flex items-center gap-2"><span className="w-3.5 h-[2.5px] rounded" style={{ background: 'var(--accent)' }} />Este periodo</span>
        <span className="flex items-center gap-2"><span className="w-3.5 h-[2.5px]"
          style={{ background: 'repeating-linear-gradient(to right, var(--text-muted) 0 4px, transparent 4px 7px)' }} />Periodo anterior</span>
      </div>
      <TrendChart current={series} previous={prevSeries} labels={labels} height={200} format={format}
        axisFormat={axisFormat} axisWidth={axisWidth} />
    </div>
  )
}
