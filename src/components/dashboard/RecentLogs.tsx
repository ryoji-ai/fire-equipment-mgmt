import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { InventoryLogWithMaterial } from '@/types/inventory'
import { formatInTimeZone } from 'date-fns-tz'

interface RecentLogsProps {
  logs: InventoryLogWithMaterial[]
}

export function RecentLogs({ logs }: RecentLogsProps) {
  if (logs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>最近の履歴</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">履歴がありません</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>最近の履歴</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>日時</TableHead>
              <TableHead>資器材名</TableHead>
              <TableHead>操作</TableHead>
              <TableHead>数量</TableHead>
              <TableHead>記録者</TableHead>
              <TableHead>メモ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  {formatInTimeZone(new Date(log.logged_at), 'Asia/Tokyo', 'M/d HH:mm')}
                </TableCell>
                <TableCell>{log.materials.name}</TableCell>
                <TableCell>
                  <Badge variant={log.type === 'in' ? 'success' : 'info'}>
                    {log.type === 'in' ? '補充' : '使用'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {log.quantity} {log.materials.unit}
                </TableCell>
                <TableCell>{log.logged_by}</TableCell>
                <TableCell className="text-gray-600">{log.note || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
