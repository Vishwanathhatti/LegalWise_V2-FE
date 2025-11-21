"use client"

import type React from "react"
import { useState } from "react"
import { usePathname } from "next/navigation"

import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { AdminAuthProvider } from "@/components/providers/admin-auth-provider"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/admin/login"
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AdminAuthProvider>
        {isLoginPage ? (
          children
        ) : (
          <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
            <AdminSidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
            <div className="flex-1 flex flex-col overflow-hidden">
              <AdminHeader onToggleSidebar={toggleSidebar} />
              <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
          </div>
        )}
      </AdminAuthProvider>
    </ThemeProvider>
  )
}
