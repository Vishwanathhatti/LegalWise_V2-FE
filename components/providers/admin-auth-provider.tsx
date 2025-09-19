"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AdminUser {
  id: string
  name: string
  email: string
  role: "admin" | "super_admin"
  avatar?: string
}

interface AdminAuthContextType {
  admin: AdminUser | null
  adminLogin: (email: string, password: string) => Promise<void>
  adminLogout: () => void
  isLoading: boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Simulate checking for existing admin session
    const savedAdmin = localStorage.getItem("legalwise_admin")
    if (savedAdmin) {
      setAdmin(JSON.parse(savedAdmin))
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

  const adminLogin = async (email: string, password: string) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simple validation - in a real app, this would be a server-side check
    if (email.includes("admin") && password.length >= 6) {
      const mockAdmin: AdminUser = {
        id: "admin1",
        name: "Admin User",
        email,
        role: email.includes("super") ? "super_admin" : "admin",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      }

      setAdmin(mockAdmin)
      localStorage.setItem("legalwise_admin", JSON.stringify(mockAdmin))
      setIsLoading(false)
    } else {
      setIsLoading(false)
      throw new Error("Invalid credentials")
    }
  }

  const adminLogout = () => {
    setAdmin(null)
    localStorage.removeItem("legalwise_admin")
    router.push("/admin/login")
  }

  return (
    <AdminAuthContext.Provider value={{ admin, adminLogin, adminLogout, isLoading }}>
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
