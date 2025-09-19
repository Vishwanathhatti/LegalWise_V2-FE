"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  ChevronDown,
  FileText,
  Flag,
  LayoutDashboard,
  MessagesSquare,
  Scale,
  Settings,
  ThumbsUp,
  Users,
  Menu,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SidebarItem {
  title: string
  href: string
  icon: React.ElementType
  submenu?: { title: string; href: string }[]
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "User Management",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Lawyer Management",
    href: "/admin/lawyers",
    icon: Scale,
  },
  {
    title: "Content",
    href: "#",
    icon: FileText,
    submenu: [
      { title: "Posts", href: "/admin/posts" },
      { title: "Comments", href: "/admin/comments" },
    ],
  },
  {
    title: "Conversations",
    href: "/admin/conversations",
    icon: MessagesSquare,
  },
  {
    title: "Reports & Flags",
    href: "/admin/reports",
    icon: Flag,
  },
  {
    title: "Documents",
    href: "/admin/documents",
    icon: FileText,
  },
  {
    title: "Feedback & Support",
    href: "/admin/feedback",
    icon: ThumbsUp,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title)
  }

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin"
    }
    return pathname?.startsWith(href) && href !== "/admin"
  }

  const isSubmenuActive = (item: SidebarItem) => {
    return item.submenu?.some((subItem) => pathname?.startsWith(subItem.href))
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-3 z-50 md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 w-64 fixed inset-y-0 left-0 z-40 transition-transform duration-300 transform md:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-800">
          <Link href="/admin" className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">LegalWise</span>
          </Link>
        </div>

        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="py-4 px-3">
            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <div key={item.title}>
                  {item.submenu ? (
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-between",
                          (isSubmenuActive(item) || openSubmenu === item.title) &&
                            "bg-gray-100 dark:bg-gray-800 text-primary",
                        )}
                        onClick={() => toggleSubmenu(item.title)}
                      >
                        <span className="flex items-center">
                          <item.icon className="mr-2 h-5 w-5" />
                          {item.title}
                        </span>
                        <ChevronDown
                          className={cn("h-4 w-4 transition-transform", openSubmenu === item.title && "rotate-180")}
                        />
                      </Button>

                      {openSubmenu === item.title && (
                        <div className="pl-8 space-y-1 mt-1">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.title}
                              href={subItem.href}
                              className={cn(
                                "block px-3 py-2 rounded-md text-sm",
                                isActive(subItem.href)
                                  ? "bg-gray-100 dark:bg-gray-800 text-primary"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
                              )}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {subItem.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-md",
                        isActive(item.href)
                          ? "bg-gray-100 dark:bg-gray-800 text-primary"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="mr-2 h-5 w-5" />
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </ScrollArea>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </>
  )
}
