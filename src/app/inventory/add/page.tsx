import { createServerClient } from '@/lib/supabase/server'
import { InventoryForm } from '@/components/inventory/InventoryForm'

export default async function InventoryAddPage() {
  const supabase = await createServerClient()

  // 資器材一覧取得（ドロップダウン用）
  const { data: materials } = await supabase
    .from('materials')
    .select('id, name, category, unit, current_quantity, min_quantity')
    .order('name', { ascending: true })

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        補充・使用登録
      </h1>
      <InventoryForm materials={materials || []} />
    </div>
  )
}
