'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Column<T> {
  key: keyof T | string
  label: string
  render?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  onView?: (item: T) => void
  isLoading?: boolean
  emptyText?: string
  loadingText?: string
}

export function DataTable<T>({
  data,
  columns,
  onEdit,
  onDelete,
  onView,
  isLoading = false,
  emptyText = '暂无数据',
  loadingText = '加载中...',
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <Table className="w-full">
        <TableHeader className="bg-gray-50">
          <TableRow>
            {columns.map((col) => (
              <TableHead key={String(col.key)} className="font-semibold text-gray-700">
                {col.label}
              </TableHead>
            ))}
            {(onEdit || onDelete || onView) && (
              <TableHead className="text-right font-semibold text-gray-700">操作</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length + (onEdit || onDelete || onView ? 1 : 0)} className="text-center py-12">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-500">{loadingText}</span>
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + (onEdit || onDelete || onView ? 1 : 0)} className="text-center py-12">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Eye className="w-8 h-8 text-gray-400" />
                  </div>
                  <span className="text-gray-500">{emptyText}</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow 
                key={String((item as any)?.id || index)} 
                className="hover:bg-blue-50/60 transition-colors"
              >
                {columns.map((col) => (
                  <TableCell key={String(col.key)} className="py-4">
                    {col.render ? (
                      col.render(item)
                    ) : (
                      <span className="text-gray-700">{String((item as any)[col.key])}</span>
                    )}
                  </TableCell>
                ))}
                {(onEdit || onDelete || onView) && (
                  <TableCell className="text-right py-4">
                    <div className="flex justify-end gap-1.5">
                      {onView && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                          onClick={() => onView(item)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                          onClick={() => onEdit(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => onDelete(item)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
