'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useShape } from '@electric-sql/react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ClipLoader } from 'react-spinners'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'

export default function Home() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [table, setTable] = useState(searchParams.get('table') || '')
  const [whereClause, setWhereClause] = useState(searchParams.get('where') || '')
  const [queryParams, setQueryParams] = useState<{ table: string; where: string }>({
    table: searchParams.get('table') || '',
    where: searchParams.get('where') || '',
  })

  const { isLoading, data, isError, error } = useShape({
    url: typeof window !== 'undefined' ? `${window.location.origin}/api/shape-proxy` : '/api/shape-proxy',
    params: queryParams,
  })

  const columnHelper = createColumnHelper<any>()

  const columns = useMemo(() => {
    if (!data || data.length === 0) return []
    return Object.keys(data[0]).map(key =>
      columnHelper.accessor(key, {
        header: key,
        cell: info => {
          const value = info.getValue()
          return typeof value === 'object' && value !== null
            ? JSON.stringify(value)
            : String(value)
        },
      })
    )
  }, [data])

  const tableInstance = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (table) params.set('table', table)
    if (whereClause) params.set('where', whereClause)
    router.push('?' + params.toString())
    setQueryParams({ table, where: whereClause })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      formRef.current?.requestSubmit()
    }
  }

  // Update query params when URL changes
  useEffect(() => {
    setQueryParams({
      table: searchParams.get('table') || '',
      where: searchParams.get('where') || '',
    })
  }, [searchParams])

  console.log({ isLoading, isError, error, data }, error?.message);

  return (
    <main className="w-full max-w-none px-4">
      <div className="bg-white shadow sm:rounded-lg mb-8 w-full">
        <div className="px-4 py-5 sm:p-6">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="table" className="block text-sm font-medium text-gray-700">
                Table Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="table"
                  value={table}
                  onChange={(e) => setTable(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="where" className="block text-sm font-medium text-gray-700">
                Where Clause
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="where"
                  value={whereClause}
                  onChange={(e) => setWhereClause(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="e.g. status = 'active'"
                />
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Query
            </button>
          </form>
        </div>
      </div>

      {isError ? (
        <div className="rounded-md bg-red-50 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error fetching data</h3>
              <div className="mt-2 text-sm text-red-700">
                {error?.message || 'An unexpected error occurred'}
              </div>
            </div>
          </div>
        </div>
      ) : isLoading ? (
        <div className="text-center py-12 inline-flex items-center justify-center space-x-2">
          <ClipLoader size={24} color="#6b7280" />
          <span className="font-semibold text-gray-500">Loading...</span>
        </div>
      ) : data && data.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg w-full">
          <div className="px-6 py-3 border-b border-gray-200 w-full">
            <div className="text-sm text-gray-500">
              {data.length} {data.length === 1 ? 'row' : 'rows'}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead>
                {tableInstance.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className="bg-gray-50">
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableInstance.getRowModel().rows.map((row, i) => (
                  <tr key={row.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => tableInstance.previousPage()}
                disabled={!tableInstance.getCanPreviousPage()}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => tableInstance.nextPage()}
                disabled={!tableInstance.getCanNextPage()}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">{tableInstance.getState().pagination.pageIndex * tableInstance.getState().pagination.pageSize + 1}</span>
                  {' '}-{' '}
                  <span className="font-medium">
                    {Math.min(
                      (tableInstance.getState().pagination.pageIndex + 1) * tableInstance.getState().pagination.pageSize,
                      data.length
                    )}
                  </span>
                  {' '}of{' '}
                  <span className="font-medium">{data.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => tableInstance.previousPage()}
                    disabled={!tableInstance.getCanPreviousPage()}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => tableInstance.nextPage()}
                    disabled={!tableInstance.getCanNextPage()}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white shadow sm:rounded-lg">
          <p className="text-sm text-gray-500">No data available</p>
        </div>
      )}
    </main>
  )
}
