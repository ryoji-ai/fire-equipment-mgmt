import { createServerClient } from '@/lib/supabase/server'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { RecentLogs } from '@/components/dashboard/RecentLogs'

export default async function DashboardPage() {
  const supabase = await createServerClient()

  // 総資器材数
  const { count: totalMaterials } = await supabase
    .from('materials')
    .select('*', { count: 'exact', head: true })

  // 在庫不足の品目数
  const { data: allMaterials } = await supabase
    .from('materials')
    .select('id, current_quantity, min_quantity')

  const lowStockCount = allMaterials?.filter(
    (m) => m.current_quantity < m.min_quantity
  ).length || 0

  // 今日の補充/使用件数
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const { count: todayLogs } = await supabase
    .from('inventory_logs')
    .select('*', { count: 'exact', head: true })
    .gte('logged_at', today.toISOString())

  // 最近の履歴10件（JOINでmaterial情報も取得）
  const { data: recentLogs } = await supabase
    .from('inventory_logs')
    .select(`
      *,
      materials (
        name,
        category,
        unit
      )
    `)
    .order('logged_at', { ascending: false })
    .limit(10)

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">ダッシュボード</h1>

      {/* サマリカード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="総資器材数"
          value={totalMaterials || 0}
          variant="default"
        />
        <StatsCard
          title="在庫不足の品目"
          value={lowStockCount}
          variant="warning"
        />
        <StatsCard
          title="今日の補充/使用件数"
          value={todayLogs || 0}
          variant="success"
        />
      </div>

      {/* 最近の履歴 */}
      <RecentLogs logs={recentLogs || []} />
    </div>
  )
}
