"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Moon, Search, Settings, Sun, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"
import { useAdminAuth } from "@/components/providers/admin-auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function AdminHeader() {
  const { setTheme } = useTheme()
  const { admin, adminLogout } = useAdminAuth()
  const [notifications] = useState(3)

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16 flex items-center px-6">
      <div className="flex-1 flex items-center">
        <div className="relative md:w-64 hidden md:block">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input placeholder="Search..." className="pl-8 h-9" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {notifications}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-2 font-medium">Notifications</div>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              <div className="p-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                <div className="font-medium">New user registration</div>
                <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">2 minutes ago</div>
              </div>
              <div className="p-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                <div className="font-medium">New lawyer verification request</div>
                <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">1 hour ago</div>
              </div>
              <div className="p-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                <div className="font-medium">Content flagged for review</div>
                <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">3 hours ago</div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <Link href="/admin/notifications" className="block p-2 text-center text-sm text-primary hover:underline">
              View all notifications
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 flex items-center gap-2 pl-2 pr-4">
              <Avatar className="h-7 w-7">
                <AvatarImage src={admin?.avatar || "/placeholder.svg"} alt={admin?.name || "Admin"} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block text-sm font-medium">{admin?.name || "Admin"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="p-2 text-sm">
              <div className="font-medium">{admin?.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{admin?.email}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 capitalize">
                {admin?.role.replace("_", " ")}
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={adminLogout} className="text-red-600 dark:text-red-400">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
