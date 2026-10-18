import { useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { spring, ease } from './motion'

// ── AnimatedCounter: cada dígito entra/sale con muelle y desenfoque ───────────
export function AnimatedCounter({ value, decimals = 0, suffix, className = '' }: {
  value: number; decimals?: number; suffix?: string; className?: string
}) {
  const reduced = useReducedMotion()
  const parts = useMemo(() => {
    const f = new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: 'always',
    })
    const ps = f.formatToParts(value)
    let place = ps.reduce((n, p) => n + (p.type === 'integer' ? p.value.length : 0), 0)
    let frac = 0
    return ps.flatMap((p, i) => {
      if (p.type === 'integer') return [...p.value].map(c => ({ key: `i${--place}`, char: c, digit: true }))
      if (p.type === 'fraction') return [...p.value].map(c => ({ key: `f${frac++}`, char: c, digit: true }))
      return [{ key: `s${p.type}${i}`, char: p.value, digit: false }]
    })
  }, [value, decimals])

  return (
    <span className={`inline-flex items-baseline whitespace-nowrap tabular ${className}`}
      style={{ letterSpacing: '-0.03em', lineHeight: 1 }}>
      {parts.map(p => p.digit ? (
        <span key={p.key} className="relative inline-flex overflow-hidden" style={{ height: '1.15em' }}>
          <span className="invisible">0</span>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={p.char} className="absolute inset-0 flex items-center justify-center"
              initial={reduced ? false : { y: '0.5em', opacity: 0, filter: 'blur(4px)' }}
              animate={{ y: '0em', opacity: 1, filter: 'blur(0px)', transition: spring.snappy }}
              exit={reduced ? undefined : { y: '-0.5em', opacity: 0, filter: 'blur(4px)', transition: { duration: 0.16, ease: ease.standard } }}>
              {p.char}
            </motion.span>
          </AnimatePresence>
        </span>
      ) : <span key={p.key} style={{ opacity: 0.8 }}>{p.char}</span>)}
      {suffix && <span className="ml-1" style={{ fontSize: '0.6em', color: 'var(--text-secondary)' }}>{suffix}</span>}
    </span>
  )
}

// ── MetricCard ────────────────────────────────────────────────────────────────
export function MetricCard({ label, value, suffix, decimals, context, change, onClick, children }: {
  label: string; value: number; suffix?: string; decimals?: number
  context?: string; change?: string; onClick?: () => void; children?: React.ReactNode
}) {
  const trend = change && /^\+/.test(change) ? 'up' : change && /^[-−]/.test(change) ? 'down' : null
  return (
    <motion.article onClick={onClick} whileTap={onClick ? { scale: 0.985 } : undefined} transition={spring.snappy}
      className={`arc-card min-w-0 p-4 sm:p-5 ${onClick ? 'cursor-pointer' : ''}`}>
      <div className="flex items-start justify-between gap-2 mb-4 sm:mb-6">
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</span>
        {change && (
          <span className="arc-pill" style={trend === 'up'
            ? { background: 'color-mix(in oklch, var(--success) 11%, transparent)', color: 'var(--success)' }
            : trend === 'down'
              ? { background: 'color-mix(in oklch, var(--danger) 11%, transparent)', color: 'var(--danger)' }
              : { border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
            {change}
          </span>
        )}
      </div>
      <AnimatedCounter value={value} suffix={suffix} decimals={decimals}
        className="font-jakarta font-semibold text-[1.6rem] sm:text-[2rem]" />
      {context && <p className="mt-3 text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>{context}</p>}
      {children}
    </motion.article>
  )
}

// ── Logo: el PNG es cuadrado con mucho margen, recortamos al logotipo ─────────
export function Logo({ width = 120 }: { width?: number }) {
  // área útil del PNG 1772×1772: x 294–1471, y 619–1153
  const k = width / 1177
  return (
    <div style={{ width, height: 534 * k, overflow: 'hidden' }}>
      <img src="/LOGO QIMMO BLUE.png" alt="qimmo"
        style={{ width: 1772 * k, maxWidth: 'none', margin: `${-619 * k}px 0 0 ${-294 * k}px`, display: 'block' }} />
    </div>
  )
}

// ── EmptyState ────────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, text }: { icon: React.ReactNode; title: string; text?: string }) {
  return (
    <div className="flex flex-col items-center text-center py-10 px-6">
      <div className="w-11 h-11 rounded-2xl grid place-items-center mb-3"
        style={{ background: 'var(--surface-muted)', color: 'var(--text-muted)' }}>{icon}</div>
      <p className="text-sm font-semibold">{title}</p>
      {text && <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{text}</p>}
    </div>
  )
}

// ── SegmentedControl: pastilla que se desliza a la opción activa ─────────────
export function SegmentedControl<T extends string>({ options, value, onChange, id }: {
  options: { value: T; label: string }[]; value: T; onChange: (v: T) => void; id: string
}) {
  return (
    <div className="inline-flex p-[3px] gap-[2px] rounded-[var(--radius-control)]"
      style={{ border: '1px solid var(--border)', background: 'var(--surface-muted)' }}>
      {options.map(o => (
        <button key={o.value} onClick={() => onChange(o.value)}
          className="relative px-3.5 h-8 text-xs font-medium whitespace-nowrap rounded-[calc(var(--radius-control)-3px)]"
          style={{ color: o.value === value ? 'var(--foreground)' : 'var(--text-secondary)', transition: 'color .16s' }}>
          {o.value === value && (
            <motion.span layoutId={`seg-${id}`} className="absolute inset-0 rounded-[inherit]"
              style={{ background: 'var(--surface)', boxShadow: 'var(--shadow-resting), 0 0 0 1px var(--border-subtle)' }}
              transition={spring.snappy} />
          )}
          <span className="relative">{o.label}</span>
        </button>
      ))}
    </div>
  )
}

// ── TrendChart: periodo actual (línea + área) vs anterior (discontinua) ──────
function splinePath(ys: number[], X: (i: number) => number, Y: (v: number) => number) {
  const n = ys.length
  if (n < 2) return ''
  const d = ys.slice(1).map((y, i) => y - ys[i])
  const m = ys.map((_, i) => {
    if (i === 0) return d[0]
    if (i === n - 1) return d[n - 2]
    return d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2
  })
  // Fritsch–Carlson: evita que la curva se pase de los datos
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue }
    const a = m[i] / d[i], b = m[i + 1] / d[i], h = a * a + b * b
    if (h > 9) { const t = 3 / Math.sqrt(h); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i] }
  }
  let p = `M${X(0)},${Y(ys[0])}`
  for (let i = 0; i < n - 1; i++) {
    const dx = (X(i + 1) - X(i)) / 3
    p += `C${X(i) + dx},${Y(ys[i] + m[i] / 3)} ${X(i + 1) - dx},${Y(ys[i + 1] - m[i + 1] / 3)} ${X(i + 1)},${Y(ys[i + 1])}`
  }
  return p
}

function niceMax(v: number) {
  if (v <= 4) return 4
  const step = Math.pow(10, Math.floor(Math.log10(v)))
  for (const k of [1, 2, 2.5, 5, 10]) if (k * step >= v) return k * step
  return 10 * step
}

export function TrendChart({ current, previous, labels, height = 220, format = String, axisFormat, axisWidth = 32 }: {
  current: number[]; previous?: number[]; labels: string[]; height?: number; format?: (n: number) => string
  axisFormat?: (n: number) => string; axisWidth?: number
}) {
  const W = 600, H = height, top = 8, bottom = 8
  const [active, setActive] = useState<number | null>(null)
  const ref = useRef<SVGSVGElement>(null)
  const max = niceMax(Math.max(...current, ...(previous ?? []), 1))
  const ticks = [0, max / 2, max]
  const n = current.length
  const X = (i: number) => (n === 1 ? W / 2 : (i / (n - 1)) * W)
  const Y = (v: number) => top + (1 - v / max) * (H - top - bottom)
  const line = splinePath(current, X, Y)
  const prevLine = previous ? splinePath(previous, X, Y) : ''
  const area = line && `${line}L${X(n - 1)},${H - bottom}L${X(0)},${H - bottom}Z`

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    setActive(Math.max(0, Math.min(n - 1, Math.round(((e.clientX - r.left) / r.width) * (n - 1)))))
  }
  const xTicks = [0, Math.floor((n - 1) / 2), n - 1]

  return (
    <div>
      <div className="flex gap-2">
        <div className="relative flex-1 min-w-0">
          <svg ref={ref} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block w-full overflow-visible"
            style={{ height: H, touchAction: 'pan-y' }} onPointerMove={onMove} onPointerLeave={() => setActive(null)}>
            {ticks.map(t => (
              <line key={t} x1={0} x2={W} y1={Y(t)} y2={Y(t)} vectorEffect="non-scaling-stroke"
                stroke={t === 0 ? 'var(--border-strong)' : 'var(--border)'} strokeWidth={1} />
            ))}
            <motion.path key={`a${line}`} d={area} fill="var(--accent)" initial={{ opacity: 0 }} animate={{ opacity: 0.07 }}
              transition={{ duration: 0.5 }} />
            {prevLine && <motion.path key={`p${prevLine}`} d={prevLine} fill="none" stroke="var(--text-muted)"
              strokeWidth={1.75} strokeDasharray="5 5" vectorEffect="non-scaling-stroke" strokeLinecap="round"
              initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ duration: 0.5 }} />}
            <motion.path key={`l${line}`} d={line} fill="none" stroke="var(--accent)" strokeWidth={2.25}
              vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: ease.enter }} />
            {active != null && (
              <line x1={X(active)} x2={X(active)} y1={top} y2={H - bottom} vectorEffect="non-scaling-stroke"
                stroke="var(--border-strong)" strokeDasharray="3 3" />
            )}
          </svg>
          {active != null && (
            <>
              <span className="absolute w-2.5 h-2.5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ left: `${(X(active) / W) * 100}%`, top: Y(current[active]), background: 'var(--surface)', border: '2px solid var(--accent)' }} />
              <div className="absolute -top-2 -translate-y-full px-2.5 py-1.5 rounded-lg text-[11px] pointer-events-none z-10 whitespace-nowrap tabular"
                style={{
                  left: `${(X(active) / W) * 100}%`, transform: `translate(${active > n * 0.7 ? '-100%' : active < n * 0.3 ? '0' : '-50%'}, -100%)`,
                  background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-raised)',
                }}>
                <p style={{ color: 'var(--text-muted)' }}>{labels[active]}</p>
                <p className="font-semibold">{format(current[active])}
                  {previous && <span className="font-normal" style={{ color: 'var(--text-muted)' }}> · antes {format(previous[active])}</span>}
                </p>
              </div>
            </>
          )}
        </div>
        <div className="relative shrink-0 text-[11px] tabular" style={{ width: axisWidth, height: H, color: 'var(--text-muted)' }}>
          {ticks.map(t => (
            <span key={t} className="absolute right-0 -translate-y-1/2" style={{ top: Y(t) }}>
              {axisFormat ? axisFormat(t) : t.toLocaleString('es-ES', { maximumFractionDigits: 1 })}
            </span>
          ))}
        </div>
      </div>
      <div className="flex justify-between mt-2 text-[11px]" style={{ color: 'var(--text-muted)', paddingRight: axisWidth + 8 }}>
        {xTicks.map(i => <span key={i}>{labels[i]}</span>)}
      </div>
    </div>
  )
}
