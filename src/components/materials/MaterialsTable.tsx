'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Material } from '@/types/material'
import { createClient } from '@/lib/supabase/client'

interface MaterialsTableProps {
  materials: Material[]
}

export function MaterialsTable({ materials }: MaterialsTableProps) {
  const router = useRouter()

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`「${name}」を削除してもよろしいですか？\n\nこの操作は取り消せません。`)) {
      return
    }

    const supabase = createClient()
    const { error } = await supabase.from('materials').delete().eq('id', id)

    if (error) {
      console.error('Delete error:', error)
      alert('削除に失敗しました')
      return
    }

    alert('削除しました')
    router.refresh()
  }

  if (materials.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        資器材が見つかりませんでした
      </div>
    )
  }

  return (
    <>
      {/* モバイル用カード表示 */}
      <div className="md:hidden space-y-3">
        {materials.map((material) => {
          const isLowStock = material.current_quantity < material.min_quantity
          const shortage = material.min_quantity - material.current_quantity

          return (
            <div
              key={material.id}
              className={`bg-white rounded-lg shadow p-4 ${isLowStock ? 'border-l-4 border-red-500' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-gray-900">{material.name}</h3>
                  <p className="text-sm text-gray-500">{material.category}</p>
                </div>
                {isLowStock ? (
                  <Badge variant="danger">不足</Badge>
                ) : (
                  <Badge variant="success">適正</Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <span className="text-gray-500">現在数:</span>
                  <span className={`ml-1 font-medium ${isLowStock ? 'text-red-600' : ''}`}>
                    {material.current_quantity}{material.unit}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">最小数:</span>
                  <span className="ml-1">{material.min_quantity}{material.unit}</span>
                </div>
                {isLowStock && (
                  <div className="col-span-2 text-red-600 font-medium">
                    {shortage}{material.unit}不足
                  </div>
                )}
              </div>

              {material.description && (
                <p className="text-sm text-gray-600 mb-3">{material.description}</p>
              )}

              <div className="flex gap-2">
                <Link href={`/materials/${material.id}/edit`} className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full">
                    編集
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(material.id, material.name)}
                >
                  削除
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* デスクトップ用テーブル表示 */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>資器材名</TableHead>
              <TableHead>カテゴリ</TableHead>
              <TableHead>現在数</TableHead>
              <TableHead>最小数</TableHead>
              <TableHead>単位</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead>説明</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.map((material) => {
              const isLowStock = material.current_quantity < material.min_quantity
              const shortage = material.min_quantity - material.current_quantity

              return (
                <TableRow
                  key={material.id}
                  className={isLowStock ? 'bg-red-50' : ''}
                >
                  <TableCell className="font-medium">{material.name}</TableCell>
                  <TableCell>{material.category}</TableCell>
                  <TableCell className={isLowStock ? 'font-bold text-red-600' : ''}>
                    {material.current_quantity}
                  </TableCell>
                  <TableCell>{material.min_quantity}</TableCell>
                  <TableCell>{material.unit}</TableCell>
                  <TableCell>
                    {isLowStock ? (
                      <Badge variant="danger">
                        在庫不足 ({shortage}{material.unit}不足)
                      </Badge>
                    ) : (
                      <Badge variant="success">適正</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm">
                    {material.description || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/materials/${material.id}/edit`}>
                        <Button variant="secondary" size="sm">
                          編集
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(material.id, material.name)}
                      >
                        削除
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
