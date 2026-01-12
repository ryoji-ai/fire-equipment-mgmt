export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      materials: {
        Row: {
          id: string
          name: string
          category: '薬品' | '器材' | '消耗品' | '医療機器' | 'その他'
          unit: '個' | '箱' | '本' | 'セット' | 'パック' | 'L'
          min_quantity: number
          current_quantity: number
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: '薬品' | '器材' | '消耗品' | '医療機器' | 'その他'
          unit: '個' | '箱' | '本' | 'セット' | 'パック' | 'L'
          min_quantity?: number
          current_quantity?: number
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: '薬品' | '器材' | '消耗品' | '医療機器' | 'その他'
          unit?: '個' | '箱' | '本' | 'セット' | 'パック' | 'L'
          min_quantity?: number
          current_quantity?: number
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      inventory_logs: {
        Row: {
          id: string
          material_id: string
          type: 'in' | 'out'
          quantity: number
          note: string | null
          logged_by: string
          logged_at: string
        }
        Insert: {
          id?: string
          material_id: string
          type: 'in' | 'out'
          quantity: number
          note?: string | null
          logged_by: string
          logged_at?: string
        }
        Update: {
          id?: string
          material_id?: string
          type?: 'in' | 'out'
          quantity?: number
          note?: string | null
          logged_by?: string
          logged_at?: string
        }
      }
    }
    Views: {
      low_stock_materials: {
        Row: {
          id: string
          name: string
          category: string
          current_quantity: number
          min_quantity: number
          shortage_quantity: number
        }
      }
    }
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
