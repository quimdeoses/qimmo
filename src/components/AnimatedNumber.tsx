import { useEffect, useRef, useState } from 'react'

interface Props {
  value: string   // e.g. "150+", "200M€", "98%"
  duration?: number
}

function parseValue(v: string): { num: number; prefix: string; suffix: string } {
  const match = v.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)([^0-9]*)$/)
  if (!match) return { num: 0, prefix: '', suffix: v }
  return { num: parseFloat(match[2]), prefix: match[1], suffix: match[3] }
}

export default function AnimatedNumber({ value, duration = 1800 }: Props) {
  const { num, prefix, suffix } = parseValue(value)
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1)
            const ease = 1 - Math.pow(1 - p, 3)
            setDisplay(Math.floor(ease * num))
            if (p < 1) requestAnimationFrame(tick)
            else setDisplay(num)
          }
          requestAnimationFrame(tick)
          observer.unobserve(el)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [num, duration])

  const formatted = num % 1 === 0
    ? display.toString()
    : display.toFixed(1)

  return (
    <span ref={ref}>
      {prefix}{formatted}{suffix}
    </span>
  )
}
