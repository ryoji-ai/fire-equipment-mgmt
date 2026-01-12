import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface TableProps {
  children: ReactNode
  className?: string
}

export function Table({ children, className }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={cn('min-w-full divide-y divide-gray-200', className)}>
        {children}
      </table>
    </div>
  )
}

interface TableHeaderProps {
  children: ReactNode
  className?: string
}

export function TableHeader({ children, className }: TableHeaderProps) {
  return (
    <thead className={cn('bg-gray-50', className)}>
      {children}
    </thead>
  )
}

interface TableBodyProps {
  children: ReactNode
  className?: string
}

export function TableBody({ children, className }: TableBodyProps) {
  return (
    <tbody className={cn('bg-white divide-y divide-gray-200', className)}>
      {children}
    </tbody>
  )
}

interface TableRowProps {
  children: ReactNode
  className?: string
}

export function TableRow({ children, className }: TableRowProps) {
  return (
    <tr className={cn('hover:bg-gray-50', className)}>
      {children}
    </tr>
  )
}

interface TableHeadProps {
  children: ReactNode
  className?: string
}

export function TableHead({ children, className }: TableHeadProps) {
  return (
    <th
      className={cn(
        'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
        className
      )}
    >
      {children}
    </th>
  )
}

interface TableCellProps {
  children: ReactNode
  className?: string
}

export function TableCell({ children, className }: TableCellProps) {
  return (
    <td className={cn('px-6 py-4 whitespace-nowrap text-sm text-gray-900', className)}>
      {children}
    </td>
  )
}
