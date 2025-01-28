'use client'

import { useState, useEffect, useRef } from 'react'
import { useShape } from '@electric-sql/react'
import { useSearchParams, useRouter } from 'next/navigation'

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

  console.log({isLoading,isError, error}, error?.message)

  return (
    <main>
      <div className="bg-white shadow sm:rounded-lg mb-8">
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
        <div className="text-center py-12">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-gray-500">
            Loading...
          </div>
        </div>
      ) : data ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-6 py-3 border-b border-gray-200">
            <div className="text-sm text-gray-500">
              {data.length} {data.length === 1 ? 'row' : 'rows'}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  {data[0] &&
                    Object.keys(data[0]).map((key) => (
                      <th
                        key={key}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500"
                      >
                        {key}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {Object.values(row).map((value, j) => (
                      <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
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
