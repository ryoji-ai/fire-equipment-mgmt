import { Database } from './database.types'

export type Material = Database['public']['Tables']['materials']['Row']
export type MaterialInsert = Database['public']['Tables']['materials']['Insert']
export type MaterialUpdate = Database['public']['Tables']['materials']['Update']

export type MaterialCategory = '薬品' | '器材' | '消耗品' | '医療機器' | 'その他'
export type MaterialUnit = '個' | '箱' | '本' | 'セット' | 'パック' | 'L'

export const MATERIAL_CATEGORIES: MaterialCategory[] = ['薬品', '器材', '消耗品', '医療機器', 'その他']
export const MATERIAL_UNITS: MaterialUnit[] = ['個', '箱', '本', 'セット', 'パック', 'L']
