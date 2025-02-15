'use client'

import { useEffect, useState } from 'react'
import UserTable from '@/components/UserTable'
import PaginationControls from '@/components/PaginationControls'
import { User } from '@/types' // Import the User interface

interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function ListUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch users from the API
  const fetchUsers = async (page: number, limit: number) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/user/list?page=${page}&limit=${limit}`)
      const data = await response.json()

      if (response.ok) {
        setUsers(data.users)
        setPagination(data.pagination)
      } else {
        setError(data.message || 'Failed to fetch users')
      }
    } catch (error) {
      setError('An error occurred while fetching users')
    } finally {
      setLoading(false)
    }
  }

  // Fetch users when the page or limit changes
  useEffect(() => {
    fetchUsers(pagination.page, pagination.limit)
  }, [pagination.page, pagination.limit])

  // Handle pagination controls
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">List of Users</h1>

          {loading ? (
            <p className="text-gray-600">Loading users...</p>
          ) : error ? (
            <p className="text-red-600">Error: {error}</p>
          ) : (
            <>
              <UserTable users={users} />
              <PaginationControls
                page={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </main>
    </div>
  )
}
