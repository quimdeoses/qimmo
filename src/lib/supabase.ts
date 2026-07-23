import { createClient } from '@supabase/supabase-js'

const url  = import.meta.env.VITE_SUPABASE_URL  as string
const key  = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(url, key)

// ── Types ────────────────────────────────────────────────────────────────────
export type TipoProp   = 'Piso' | 'Àtic' | 'Duplex' | 'Casa' | 'Local' | 'Oficina' | 'Nave'
export type ZonaProp   = 'Barcelona' | 'Zona Alta' | 'Área Metropolitana' | 'Costa Daurada' | 'Vallès'
export type EnergiaCert = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'
export type BadgeProp  = 'Nueva incorporación' | 'Off-market' | 'Inversión' | 'Precio reducido'

export interface Propiedad {
  id: number
  ref: string
  titulo: string
  tipo: TipoProp
  zona: ZonaProp
  barrio: string
  direccion: string
  precio: number
  m2: number
  habitaciones: number | null
  banos: number | null
  planta: string | null
  terraza: boolean
  garage: boolean
  ascensor: boolean
  piscina: boolean
  imagen: string
  imagenes: string[]
  badge: BadgeProp | null
  descripcion: string
  caracteristicas: string[]
  energia: EnergiaCert
  lat: number
  lng: number
  publicado: boolean
  created_at: string
}
