import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { CheckCircle, AlertCircle, X, Search, CornerDownLeft } from 'lucide-react'
import { spring, ease } from './motion'

// ── ToastStack (abajo a la derecha, se apilan y se expanden al pasar el ratón) ─
export interface ToastItem { id: number; msg: string; ok: boolean }

export function ToastStack({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: number) => void }) {
  const [hover, setHover] = useState(false)
  useEffect(() => {
    if (hover || !toasts.length) return
    const t = setTimeout(() => onDismiss(toasts[0].id), 4000)
    return () => clearTimeout(t)
  }, [toasts, hover, onDismiss])

  const visible = toasts.slice(-3)
  return (
    <div className="fixed z-[200] bottom-[calc(80px+env(safe-area-inset-bottom))] md:bottom-6 right-4 md:right-6 w-[min(22rem,calc(100%-2rem))]"
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <ul className="relative" style={{ height: 56 }}>
        <AnimatePresence initial={false}>
          {visible.map((t, i) => {
            const depth = visible.length - 1 - i
            return (
              <motion.li key={t.id} layout className="absolute inset-x-0 bottom-0"
                style={{ zIndex: 10 - depth, transformOrigin: '50% 0' }}
                initial={{ opacity: 0, y: 24, scale: 0.96, filter: 'blur(4px)' }}
                animate={{
                  opacity: depth > 2 ? 0 : 1, filter: 'blur(0px)',
                  y: hover ? -depth * 64 : -depth * 10,
                  scale: hover ? 1 : 1 - depth * 0.05,
                }}
                exit={{ opacity: 0, y: 12, scale: 0.96, filter: 'blur(4px)', transition: { duration: 0.18, ease: ease.standard } }}
                transition={spring.gentle}>
                <div className="flex items-start gap-3 py-3 pl-4 pr-3"
                  style={{
                    borderRadius: 'var(--radius-panel)', border: '1px solid var(--border)',
                    background: depth && !hover ? 'var(--surface-muted)' : 'var(--surface-raised)',
                    boxShadow: 'var(--shadow-floating)',
                  }}>
                  <span className="mt-0.5" style={{ color: t.ok ? 'var(--success)' : 'var(--danger)' }}>
                    {t.ok ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  </span>
                  <span className="flex-1 text-sm" style={{ color: 'var(--foreground)' }}>{t.msg}</span>
                  <button onClick={() => onDismiss(t.id)} className="p-1 rounded-md" style={{ color: 'var(--text-muted)' }}>
                    <X size={13} />
                  </button>
                </div>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </ul>
    </div>
  )
}

// ── CommandPalette (⌘K / Ctrl+K) ──────────────────────────────────────────────
export interface CommandItem {
  id: string
  group: string
  label: string
  hint?: string
  icon?: React.ReactNode
  run: () => void
}

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

export function CommandPalette({ open, onClose, items, loading }: {
  open: boolean; onClose: () => void; items: CommandItem[]; loading?: boolean
}) {
  return (
    <AnimatePresence>
      {open && <PaletteBody onClose={onClose} items={items} loading={loading} />}
    </AnimatePresence>
  )
}

// Se monta al abrir, así la búsqueda empieza siempre vacía
function PaletteBody({ onClose, items, loading }: { onClose: () => void; items: CommandItem[]; loading?: boolean }) {
  const [q, setQ] = useState('')
  const [idx, setIdx] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    const terms = norm(q).split(/\s+/).filter(Boolean)
    const r = terms.length
      ? items.filter(i => { const h = norm(`${i.label} ${i.hint ?? ''} ${i.group}`); return terms.every(t => h.includes(t)) })
      : items.filter(i => i.group === 'Ir a' || i.group === 'Acciones')
    return r.slice(0, 40)
  }, [q, items])

  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${idx}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [idx])

  const choose = (i: CommandItem | undefined) => { if (!i) return; onClose(); i.run() }
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIdx(i => Math.min(i + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setIdx(i => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); choose(results[idx]) }
    else if (e.key === 'Escape') onClose()
  }

  let lastGroup = ''
  return (
        <motion.div className="fixed inset-0 z-[150] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          style={{ background: 'color-mix(in oklch, #0D1F3C 22%, transparent)', backdropFilter: 'blur(2px)' }}
          onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
          <motion.div className="w-full max-w-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.97, y: -8, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.98, y: -4, transition: { duration: 0.14 } }}
            transition={spring.responsive}
            style={{
              borderRadius: 'var(--radius-panel)', border: '1px solid var(--border)',
              background: 'var(--surface)', boxShadow: 'var(--shadow-floating)', transformOrigin: 'top center',
            }}>
            <div className="flex items-center gap-2.5 px-4 min-h-[54px]" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <Search size={17} style={{ color: 'var(--text-muted)' }} />
              <input autoFocus value={q} onChange={e => { setQ(e.target.value); setIdx(0) }} onKeyDown={onKey}
                placeholder="Buscar leads, propiedades, facturas… o ir a una sección"
                className="flex-1 min-w-0 bg-transparent border-0 outline-none text-sm" style={{ color: 'var(--foreground)' }} />
              <span className="arc-kbd">esc</span>
            </div>
            <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
              {results.length === 0 ? (
                <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>
                  {loading ? 'Cargando…' : 'Sin resultados'}
                </p>
              ) : results.map((r, i) => {
                const header = r.group !== lastGroup ? (lastGroup = r.group) : null
                const active = i === idx
                return (
                  <div key={r.id}>
                    {header && <p className="px-3 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--text-muted)' }}>{header}</p>}
                    <button data-idx={i} onMouseMove={() => setIdx(i)} onClick={() => choose(r)}
                      className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left">
                      {active && <motion.span layoutId="cmd-active" className="absolute inset-0 rounded-xl"
                        style={{ background: 'var(--surface-muted)' }} transition={spring.snappy} />}
                      <span className="relative" style={{ color: 'var(--text-muted)' }}>{r.icon}</span>
                      <span className="relative flex-1 min-w-0 truncate text-sm font-medium">{r.label}</span>
                      {r.hint && <span className="relative text-xs truncate max-w-[40%]" style={{ color: 'var(--text-muted)' }}>{r.hint}</span>}
                      {active && <CornerDownLeft size={13} className="relative" style={{ color: 'var(--text-muted)' }} />}
                    </button>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
  )
}

// ── Sheet: hoja inferior en móvil, panel centrado en escritorio ──────────────
export function Sheet({ open, onClose, title, children, footer, wide = false }: {
  open: boolean; onClose: () => void; title: React.ReactNode
  children: React.ReactNode; footer?: React.ReactNode; wide?: boolean
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center sm:p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ background: 'color-mix(in oklch, #0D1F3C 30%, transparent)' }}
          onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
          <motion.div className={`w-full ${wide ? 'sm:max-w-2xl' : 'sm:max-w-lg'} max-h-[92dvh] flex flex-col rounded-t-[1.75rem] sm:rounded-[var(--radius-surface)]`}
            initial={{ y: 48, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 48, opacity: 0 }} transition={spring.gentle}
            drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, i) => { if (i.offset.y > 120 || i.velocity.y > 600) onClose() }}
            style={{ background: 'var(--surface)', boxShadow: 'var(--shadow-floating)' }}>
            <div className="sm:hidden flex justify-center pt-2.5 cursor-grab"><span className="w-10 h-1 rounded-full" style={{ background: 'var(--border-strong)' }} /></div>
            <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3">
              <div className="min-w-0 flex-1">{title}</div>
              <button onClick={onClose} className="p-1.5 -mr-1.5 rounded-lg" style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-4" onPointerDownCapture={e => e.stopPropagation()}>{children}</div>
            {footer && (
              <div className="flex items-center gap-3 px-5 py-4"
                style={{ borderTop: '1px solid var(--border)', paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
