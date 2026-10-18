import { useMemo, useState } from 'react'
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

// ── BarChart: barras diarias con tooltip ─────────────────────────────────────
export function BarChart({ data, labels, height = 120, format = String }: {
  data: number[]; labels?: string[]; height?: number; format?: (n: number) => string
}) {
  const [active, setActive] = useState<number | null>(null)
  const max = Math.max(...data, 1)
  return (
    <div className="relative flex items-end gap-[3px]" style={{ height }} onPointerLeave={() => setActive(null)}>
      {data.map((v, i) => (
        <div key={i} className="relative flex-1 h-full flex items-end" onPointerEnter={() => setActive(i)}>
          <motion.div className="w-full rounded-[4px]"
            initial={{ height: 0 }} animate={{ height: `${Math.max(v / max * 100, v ? 6 : 2)}%` }}
            transition={{ ...spring.gentle, delay: i * 0.012 }}
            style={{
              background: v ? (active === i ? 'var(--gold)' : 'var(--accent)') : 'var(--border)',
              opacity: active == null || active === i ? 1 : 0.55,
              transition: 'opacity .16s, background-color .16s',
            }} />
          {active === i && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap pointer-events-none tabular z-10"
              style={{ background: 'var(--accent)', color: 'var(--accent-foreground)' }}>
              {labels?.[i] ? `${labels[i]} · ` : ''}{format(v)}
            </div>
          )}
        </div>
      ))}
    </div>
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
