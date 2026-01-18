'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

interface MaterialForInventory {
  id: string
  name: string
  category: string
  unit: string
  current_quantity: number
  min_quantity: number
}

interface InventoryFormProps {
  materials: MaterialForInventory[]
}

export function InventoryForm({ materials }: InventoryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedMaterialId, setSelectedMaterialId] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const materialId = formData.get('material_id') as string
    const type = formData.get('type') as 'in' | 'out'
    const quantity = parseInt(formData.get('quantity') as string)
    const note = formData.get('note') as string
    const loggedBy = formData.get('logged_by') as string

    if (!materialId || !type || !quantity || !loggedBy) {
      setError('すべての必須項目を入力してください')
      setLoading(false)
      return
    }

    const supabase = createClient()

    // 現在の在庫情報を取得
    const currentMaterial = materials.find((m) => m.id === materialId)
    if (!currentMaterial) {
      setError('資器材が見つかりません')
      setLoading(false)
      return
    }

    // 在庫不足チェック（使用の場合）
    if (type === 'out' && quantity > currentMaterial.current_quantity) {
      setError(`在庫数が不足しています（現在: ${currentMaterial.current_quantity}${currentMaterial.unit}）`)
      setLoading(false)
      return
    }

    // 1. 在庫履歴に記録
    const { error: logError } = await supabase.from('inventory_logs').insert({
      material_id: materialId,
      type,
      quantity,
      note: note || null,
      logged_by: loggedBy,
    })

    if (logError) {
      console.error('Log error:', logError)
      setError('履歴の記録に失敗しました')
      setLoading(false)
      return
    }

    // 2. 在庫数を更新
    const newQuantity =
      type === 'in'
        ? currentMaterial.current_quantity + quantity
        : currentMaterial.current_quantity - quantity

    const { error: updateError } = await supabase
      .from('materials')
      .update({ current_quantity: newQuantity })
      .eq('id', materialId)

    if (updateError) {
      console.error('Update error:', updateError)
      setError('在庫の更新に失敗しました')
      setLoading(false)
      return
    }

    // 3. 成功後、ダッシュボードにリダイレクト
    alert('登録が完了しました')
    router.push('/')
    router.refresh() // サーバーコンポーネント再フェッチ
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* 資器材選択 */}
          <div>
            <label
              htmlFor="material_id"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              資器材 <span className="text-red-500">*</span>
            </label>
            <select
              id="material_id"
              name="material_id"
              required
              value={selectedMaterialId}
              onChange={(e) => setSelectedMaterialId(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">選択してください</option>
              {materials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.name} （現在: {material.current_quantity}
                  {material.unit}）
                </option>
              ))}
            </select>
          </div>

          {/* 操作タイプ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              操作タイプ <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center justify-center cursor-pointer border border-gray-300 rounded-lg p-4 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-700 transition-colors">
                <input
                  type="radio"
                  name="type"
                  value="in"
                  required
                  className="sr-only"
                />
                <span className="font-medium">補充</span>
              </label>
              <label className="flex items-center justify-center cursor-pointer border border-gray-300 rounded-lg p-4 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-700 transition-colors">
                <input
                  type="radio"
                  name="type"
                  value="out"
                  required
                  className="sr-only"
                />
                <span className="font-medium">使用</span>
              </label>
            </div>
          </div>

          {/* 数量 */}
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              数量 <span className="text-red-500">*</span>
            </label>
            <input
              id="quantity"
              type="number"
              name="quantity"
              min="1"
              required
              inputMode="numeric"
              className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* メモ */}
          <div>
            <label
              htmlFor="note"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              メモ
            </label>
            <textarea
              id="note"
              name="note"
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例: 定期発注分、訓練使用、救急出動時使用"
            />
          </div>

          {/* 記録者 */}
          <div>
            <label
              htmlFor="logged_by"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              記録者名 <span className="text-red-500">*</span>
            </label>
            <input
              id="logged_by"
              type="text"
              name="logged_by"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例: 田中太郎"
            />
          </div>

          {/* 送信ボタン */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button type="submit" disabled={loading} className="flex-1 py-3">
              {loading ? '登録中...' : '登録する'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/')}
              disabled={loading}
              className="py-3"
            >
              キャンセル
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
