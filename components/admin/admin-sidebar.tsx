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

export function AdminSidebar({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: () => void }) {
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
          "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 fixed inset-y-0 left-0 z-40 transition-all duration-300",
          // Mobile: slide in/out with overlay
          "md:relative md:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: toggle between collapsed and expanded
          isCollapsed ? "md:w-16" : "md:w-64",
        )}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-800">
          <Link href="/admin" className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" />
            {!isCollapsed && <span className="font-bold text-xl hidden md:inline">LegalWise</span>}
            <span className="font-bold text-xl md:hidden">LegalWise</span>
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
                          "w-full",
                          isCollapsed ? "justify-center px-2" : "justify-between",
                          (isSubmenuActive(item) || openSubmenu === item.title) &&
                            "bg-gray-100 dark:bg-gray-800 text-primary",
                        )}
                        onClick={() => toggleSubmenu(item.title)}
                        title={isCollapsed ? item.title : undefined}
                      >
                        <span className="flex items-center">
                          <item.icon className={cn("h-5 w-5", !isCollapsed && "mr-2")} />
                          {!isCollapsed && <span className="hidden md:inline">{item.title}</span>}
                          <span className="md:hidden">{item.title}</span>
                        </span>
                        {!isCollapsed && (
                          <ChevronDown
                            className={cn("h-4 w-4 transition-transform hidden md:block", openSubmenu === item.title && "rotate-180")}
                          />
                        )}
                        <ChevronDown
                          className={cn("h-4 w-4 transition-transform md:hidden", openSubmenu === item.title && "rotate-180")}
                        />
                      </Button>

                      {openSubmenu === item.title && !isCollapsed && (
                        <div className="pl-8 space-y-1 mt-1 hidden md:block">
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
                            >
                              {subItem.title}
                            </Link>
                          ))}
                        </div>
                      )}
                      
                      {/* Mobile submenu - always show when open */}
                      {openSubmenu === item.title && (
                        <div className="pl-8 space-y-1 mt-1 md:hidden">
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
                        isCollapsed ? "justify-center" : "",
                        isActive(item.href)
                          ? "bg-gray-100 dark:bg-gray-800 text-primary"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                      title={isCollapsed ? item.title : undefined}
                    >
                      <item.icon className={cn("h-5 w-5", !isCollapsed && "mr-2")} />
                      {!isCollapsed && <span className="hidden md:inline">{item.title}</span>}
                      <span className="md:hidden">{item.title}</span>
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
