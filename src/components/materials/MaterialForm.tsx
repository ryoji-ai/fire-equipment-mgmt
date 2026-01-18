'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Material, MATERIAL_CATEGORIES, MATERIAL_UNITS } from '@/types/material'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

interface MaterialFormProps {
  material?: Material
  mode: 'create' | 'edit'
}

export function MaterialForm({ material, mode }: MaterialFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const category = formData.get('category') as string
    const unit = formData.get('unit') as string
    const minQuantity = parseInt(formData.get('min_quantity') as string)
    const currentQuantity = parseInt(formData.get('current_quantity') as string)
    const description = formData.get('description') as string

    if (!name || !category || !unit) {
      setError('すべての必須項目を入力してください')
      setLoading(false)
      return
    }

    const supabase = createClient()

    if (mode === 'create') {
      // 新規登録
      const { error: insertError } = await supabase.from('materials').insert({
        name,
        category,
        unit,
        min_quantity: minQuantity,
        current_quantity: currentQuantity,
        description: description || null,
      })

      if (insertError) {
        console.error('Insert error:', insertError)
        setError('登録に失敗しました')
        setLoading(false)
        return
      }

      alert('資器材を登録しました')
    } else {
      // 編集
      const { error: updateError } = await supabase
        .from('materials')
        .update({
          name,
          category,
          unit,
          min_quantity: minQuantity,
          current_quantity: currentQuantity,
          description: description || null,
        })
        .eq('id', material!.id)

      if (updateError) {
        console.error('Update error:', updateError)
        setError('更新に失敗しました')
        setLoading(false)
        return
      }

      alert('資器材を更新しました')
    }

    router.push('/materials')
    router.refresh()
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

          {/* 資器材名 */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              資器材名 <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              required
              defaultValue={material?.name || ''}
              className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例: 生理食塩水 500ml"
            />
          </div>

          {/* カテゴリ */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              カテゴリ <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              required
              defaultValue={material?.category || ''}
              className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">選択してください</option>
              {MATERIAL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 単位 */}
          <div>
            <label
              htmlFor="unit"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              単位 <span className="text-red-500">*</span>
            </label>
            <select
              id="unit"
              name="unit"
              required
              defaultValue={material?.unit || ''}
              className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">選択してください</option>
              {MATERIAL_UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          {/* 在庫数（2列グリッド） */}
          <div className="grid grid-cols-2 gap-4">
            {/* 最小在庫数 */}
            <div>
              <label
                htmlFor="min_quantity"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                最小在庫数 <span className="text-red-500">*</span>
              </label>
              <input
                id="min_quantity"
                type="number"
                name="min_quantity"
                min="0"
                required
                inputMode="numeric"
                defaultValue={material?.min_quantity || 0}
                className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 現在の在庫数 */}
            <div>
              <label
                htmlFor="current_quantity"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                現在の在庫数 <span className="text-red-500">*</span>
              </label>
              <input
                id="current_quantity"
                type="number"
                name="current_quantity"
                min="0"
                required
                inputMode="numeric"
                defaultValue={material?.current_quantity || 0}
                className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 説明・備考 */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              説明・備考
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={material?.description || ''}
              className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例: 点滴・洗浄用"
            />
          </div>

          {/* ボタン */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button type="submit" disabled={loading} className="flex-1 py-3">
              {loading
                ? mode === 'create'
                  ? '登録中...'
                  : '更新中...'
                : mode === 'create'
                ? '登録する'
                : '更新する'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/materials')}
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
