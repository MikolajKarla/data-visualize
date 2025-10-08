import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import toast from 'react-hot-toast'

interface User {
  id: number
  email: string
  profile?: {
    first_name?: string
    last_name?: string
    bio?: string
    avatar_url?: string
  }
  settings?: {
    theme: string
    notifications_enabled: boolean
    language: string
  }
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string, skipToast?: boolean) => Promise<void>
  register: (email: string, password: string, firstName?: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  refreshUser: () => Promise<void>
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string, skipToast = false) => {
        set({ isLoading: true })
        try {
          const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.detail || 'Login failed')
          }

          const data = await response.json()
          set({ token: data.access_token, isAuthenticated: true })

          // Fetch user data
          await get().refreshUser()
          
          // Show success toast only if not skipped
          if (!skipToast) {
            toast.success('Login successful! Welcome back.')
          }
        } catch (error) {
          console.error('Login error:', error)
          if (!skipToast) {
            toast.error(error instanceof Error ? error.message : 'Login failed. Please try again.')
          }
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      register: async (email: string, password: string, firstName?: string) => {
        set({ isLoading: true })
        try {
          const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              email, 
              password,
              first_name: firstName 
            }),
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.detail || 'Registration failed')
          }

          // Show registration success toast
          toast.success('Registration successful! Welcome to the app!')
          
          // Auto login after registration (skip login toast)
          await get().login(email, password, true)
        } catch (error) {
          console.error('Registration error:', error)
          toast.error(error instanceof Error ? error.message : 'Registration failed. Please try again.')
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        })
        toast.success('Logged out successfully. See you next time!')
      },

      setUser: (user: User) => {
        set({ user })
      },

      refreshUser: async () => {
        const { token } = get()
        if (!token) return

        try {
          const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })

          if (!response.ok) {
            throw new Error('Failed to fetch user data')
          }

          const userData = await response.json()
          set({ user: userData })
        } catch (error) {
          console.error('Refresh user error:', error)
          toast.error('Session expired. Please log in again.')
          get().logout()
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Initialize user data if token exists
        if (state?.token && state?.isAuthenticated) {
          // Don't block UI, just refresh user data in background
          state.refreshUser().catch(() => {
            // If refresh fails, user will be logged out automatically
          })
        }
      },
    }
  )
)
