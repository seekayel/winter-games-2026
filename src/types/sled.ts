export type SledVariant = 'basic' | 'sport' | 'pro' | 'elite' | 'legendary'

export interface SledDef {
  id: string
  name: string
  price: number
  speed: number
  accel: number
  handling: number
  braking: number
  variant: SledVariant
  color: string
  accentColor: string
}
