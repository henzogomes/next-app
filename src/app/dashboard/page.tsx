'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header' // Adjust the import path as needed

interface UserPayload {
  uuid: string
  email: string
}

interface ApiResponse {
  success: boolean
  user: UserPayload
}

const DashboardPage = () => {
  const [user, setUser] = useState<UserPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/user/info')
        const data: ApiResponse = await response.json()

        console.log('Received data:', data)

        if (data.success && data.user) {
          console.log('User data:', data.user)
          setUser(data.user)
          localStorage.setItem('cachedUser', JSON.stringify(data.user))
        } else {
          setError(data.success ? 'User data not found' : 'Failed to fetch user data')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        setError('An error occurred while fetching user data')
      } finally {
        setLoading(false)
      }
    }

    const cachedUser = localStorage.getItem('cachedUser')
    if (cachedUser) {
      setUser(JSON.parse(cachedUser))
      setLoading(false)
    } else {
      fetchUserData()
    }
  }, [])

  if (loading) {
    return <p className="text-gray-600">Loading your dashboard...</p>
  }

  if (error) {
    return <p className="text-red-600">Error: {error}</p>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header /> {/* Include the Header component here */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          {user ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Welcome to your Dashboard, {user.email}!
              </h2>
              <p className="text-gray-600">
                Your UUID: <span className="font-mono">{user.uuid}</span>
              </p>
              <div className="border-t border-gray-200 pt-4">
                <i className="text-blue-600">Enjoy your stay!</i>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">Loading your dashboard...</p>
          )}
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
