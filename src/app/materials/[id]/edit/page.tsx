import { createServerClient } from '@/lib/supabase/server'
import { MaterialForm } from '@/components/materials/MaterialForm'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditMaterialPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createServerClient()

  // 資器材データを取得
  const { data: material, error } = await supabase
    .from('materials')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !material) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        資器材の編集
      </h1>
      <MaterialForm mode="edit" material={material} />
    </div>
  )
}
