"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { api } from "@/lib/api"

type UserRole = "user" | "lawyer"

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("legalwise_token")
      const savedUser = localStorage.getItem("legalwise_user")

      if (token && savedUser) {
        try {
          // Verify token by fetching profile
          const profile = await api.getProfile()
          setUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role as UserRole,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.email}`,
          })
        } catch (error) {
          // Token invalid, clear storage
          localStorage.removeItem("legalwise_token")
          localStorage.removeItem("legalwise_user")
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await api.login(email, password)

      const userData: User = {
        id: response.user._id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role as UserRole,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${response.user.email}`,
      }

      setUser(userData)
      localStorage.setItem("legalwise_token", response.token)
      localStorage.setItem("legalwise_user", JSON.stringify(userData))
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await api.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      localStorage.removeItem("legalwise_token")
      localStorage.removeItem("legalwise_user")
    }
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
