import { Database } from './database.types'
import { Material } from './material'

export type InventoryLog = Database['public']['Tables']['inventory_logs']['Row']
export type InventoryLogInsert = Database['public']['Tables']['inventory_logs']['Insert']
export type InventoryLogUpdate = Database['public']['Tables']['inventory_logs']['Update']

export type InventoryLogType = 'in' | 'out'

export interface InventoryLogWithMaterial extends InventoryLog {
  materials: Material
}
