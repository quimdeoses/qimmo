import type { PeriodOption } from './PeriodTrend'

export const LEAD_PERIODS: PeriodOption[] = [
  { value: '7', label: '7 días', days: 7 },
  { value: '30', label: '30 días', days: 30 },
  { value: '90', label: '90 días', days: 90 },
]

export const REVENUE_PERIODS: PeriodOption[] = [
  { value: '30', label: '30 días', days: 30 },
  { value: '90', label: '90 días', days: 90 },
  { value: '365', label: '12 meses', days: 365 },
]

export const eur0 = (n: number) => n.toLocaleString('es-ES', { maximumFractionDigits: 0, useGrouping: 'always' }) + ' €'
// Eje: 0 · 2,5k · 5k …
export const eurAxis = (n: number) =>
  n >= 1000 ? `${(n / 1000).toLocaleString('es-ES', { maximumFractionDigits: 1 })}k` : String(n)

// Facturas que cuentan como facturado: emitidas, no anuladas ni borradores
export const isBilled = (status: string) => status !== 'anulada' && status !== 'borrador'
