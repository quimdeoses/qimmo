// Tipos y utilidades compartidas del CRM (leads y visitas)
export interface Lead {
  id: number
  nombre: string
  telefono: string
  email: string
  tipo: 'valoracion' | 'contacto' | 'interes_propiedad' | 'visita'
  mensaje: string | null
  propiedad_ref: string | null
  estado: 'nuevo' | 'contactado' | 'en_proceso' | 'cerrado' | 'descartado'
  notas: string | null
  created_at: string
}

export interface Visita {
  id: number
  propiedad_ref: string
  propiedad_titulo: string
  nombre: string
  telefono: string
  email: string
  fecha: string
  hora: string
  estado: 'pendiente' | 'confirmada' | 'realizada' | 'cancelada'
  notas: string | null
  created_at: string
}

export type Notify = (m: string, ok?: boolean) => void

export const LEAD_ESTADOS: Lead['estado'][] = ['nuevo', 'contactado', 'en_proceso', 'cerrado', 'descartado']
export const VISITA_ESTADOS: Visita['estado'][] = ['pendiente', 'confirmada', 'realizada', 'cancelada']

export const ESTADO_LABEL: Record<string, string> = {
  nuevo: 'Nuevo', contactado: 'Contactado', en_proceso: 'En proceso',
  cerrado: 'Cerrado', descartado: 'Descartado',
  pendiente: 'Pendiente', confirmada: 'Confirmada', realizada: 'Realizada', cancelada: 'Cancelada',
}

// Tonos Arc: fondo suave + texto del mismo color
const tone = (c: string) => ({ bg: `color-mix(in oklch, ${c} 12%, transparent)`, text: c })
export const ESTADO_TONE: Record<string, { bg: string; text: string }> = {
  nuevo:      tone('oklch(55% 0.17 255)'),
  contactado: tone('oklch(52% 0.15 152)'),
  en_proceso: tone('oklch(60% 0.15 70)'),
  cerrado:    tone('oklch(45% 0.03 258)'),
  descartado: tone('oklch(55% 0.2 25)'),
  pendiente:  tone('oklch(60% 0.15 70)'),
  confirmada: tone('oklch(52% 0.15 152)'),
  realizada:  tone('oklch(45% 0.03 258)'),
  cancelada:  tone('oklch(55% 0.2 25)'),
}

export const TIPO_LABEL: Record<string, string> = {
  valoracion: 'Valoración', contacto: 'Contacto', interes_propiedad: 'Interés propiedad', visita: 'Visita',
}

// Teléfono → enlace de WhatsApp (asume España si son 9 dígitos)
export function waLink(tel: string, text?: string) {
  let d = tel.replace(/\D/g, '')
  if (d.startsWith('00')) d = d.slice(2)
  if (d.length === 9) d = '34' + d
  return `https://wa.me/${d}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}

export function timeAgo(iso: string, now = Date.now()) {
  const m = Math.round((now - new Date(iso).getTime()) / 60000)
  if (m < 60) return `hace ${Math.max(m, 1)} min`
  const h = Math.round(m / 60)
  if (h < 24) return `hace ${h} h`
  const d = Math.round(h / 24)
  if (d < 30) return `hace ${d} d`
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}
