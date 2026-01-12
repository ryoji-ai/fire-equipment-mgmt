import { Card, CardContent } from '@/components/ui/Card'

interface StatsCardProps {
  title: string
  value: number
  icon?: string
  variant?: 'default' | 'warning' | 'success'
}

export function StatsCard({ title, value, variant = 'default' }: StatsCardProps) {
  const variantStyles = {
    default: 'border-l-4 border-blue-500',
    warning: 'border-l-4 border-yellow-500',
    success: 'border-l-4 border-green-500',
  }

  return (
    <Card className={variantStyles[variant]}>
      <CardContent>
        <div className="flex flex-col">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}
