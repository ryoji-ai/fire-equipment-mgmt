import { createServerClient } from '@/lib/supabase/server'
import { MaterialsTable } from '@/components/materials/MaterialsTable'
import { CategoryFilter } from '@/components/materials/CategoryFilter'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

interface PageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function MaterialsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const selectedCategory = params.category || 'all'

  const supabase = await createServerClient()

  // カテゴリフィルタ適用
  let query = supabase
    .from('materials')
    .select('*')
    .order('name', { ascending: true })

  if (selectedCategory && selectedCategory !== 'all') {
    query = query.eq('category', selectedCategory)
  }

  const { data: materials, error } = await query

  if (error) {
    console.error('Error fetching materials:', error)
  }

  // カテゴリ一覧取得（重複なし）
  const { data: allMaterials } = await supabase
    .from('materials')
    .select('category')

  const uniqueCategories = [
    ...new Set(allMaterials?.map((m) => m.category) || []),
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">資器材一覧</h1>
        <Link href="/materials/new">
          <Button>新規登録</Button>
        </Link>
      </div>

      {/* カテゴリフィルタ */}
      <CategoryFilter
        categories={uniqueCategories}
        selectedCategory={selectedCategory}
      />

      {/* 資器材テーブル */}
      <MaterialsTable materials={materials || []} />
    </div>
  )
}
