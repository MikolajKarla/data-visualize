'use client'

import { useEffect } from 'react'
import { useAuth } from '@/lib/auth'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (isAuthenticated && !user) {
      // If authenticated but no user data, try to refresh
      useAuth.getState().refreshUser()
    }
  }, [isAuthenticated, user])

  return <>{children}</>
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/auth/login'
    }
  }, [isAuthenticated, isLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
