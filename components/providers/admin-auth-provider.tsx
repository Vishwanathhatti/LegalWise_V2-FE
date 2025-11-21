"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AdminUser {
  _id: string
  name: string
  email: string
  phone: string
  role: string
  profilePicture?: string
  lawyerId?: any
}

interface AdminAuthContextType {
  admin: AdminUser | null
  adminLogout: () => void
  adminLogin: (data: { user: AdminUser; token: string }) => void
  isLoading: boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check for existing admin session
    const token = localStorage.getItem("legalwise_token")
    const savedUser = localStorage.getItem("legalwise_user")
    
    if (token && savedUser) {
      try {
        const user = JSON.parse(savedUser)
        // Only set admin if user has admin role
        if (user.role === "admin") {
          setAdmin(user)
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("legalwise_token")
        localStorage.removeItem("legalwise_user")
      }
    }
    setIsLoading(false)
  }, [])

  // Protect admin routes
  useEffect(() => {
    if (!isLoading) {
      // If not on login page and not authenticated, redirect to login
      if (pathname?.startsWith("/admin") && pathname !== "/admin/login" && !admin) {
        router.push("/admin/login")
      }

      // If on login page and already authenticated, redirect to admin dashboard
      if (pathname === "/admin/login" && admin) {
        router.push("/admin")
      }
    }
  }, [admin, isLoading, pathname, router])

  const adminLogin = (data: { user: AdminUser; token: string }) => {
    setAdmin(data.user)
    localStorage.setItem("legalwise_token", data.token)
    localStorage.setItem("legalwise_user", JSON.stringify(data.user))
    router.push("/admin")
  }

  const adminLogout = () => {
    setAdmin(null)
    localStorage.removeItem("legalwise_token")
    localStorage.removeItem("legalwise_user")
    router.push("/admin/login")
  }

  return (
    <AdminAuthContext.Provider value={{ admin, adminLogout, adminLogin, isLoading }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}
