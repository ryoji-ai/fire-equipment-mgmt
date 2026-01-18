import { MaterialForm } from '@/components/materials/MaterialForm'

export default function NewMaterialPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        資器材の新規登録
      </h1>
      <MaterialForm mode="create" />
    </div>
  )
}
