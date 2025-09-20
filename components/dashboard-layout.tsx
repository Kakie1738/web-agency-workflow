"use client"

import type React from "react"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  CheckSquare,
  MessageSquare,
  BarChart3,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  Zap,
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard, badge: undefined },
    { name: "CRM & Leads", href: "/crm", icon: Users, badge: "12" },
    { name: "Projects", href: "/projects", icon: FolderOpen, badge: "8" },
    { name: "QA & Launch", href: "/qa", icon: CheckSquare, badge: undefined },
    { name: "Client Portal", href: "/clients", icon: MessageSquare, badge: "3" },
    { name: "Analytics", href: "/analytics", icon: BarChart3, badge: undefined },
    { name: "Settings", href: "/settings", icon: Settings, badge: undefined },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center animate-pulse-glow">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-sidebar-foreground">WAWS</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <nav className="mt-6 px-3">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={`group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 animate-slide-in ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "ml-0"}`}>
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-40 glass-effect">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
                <Menu className="w-4 h-4" />
              </Button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search projects, clients, tasks..."
                  className="pl-10 pr-4 py-2 w-80 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
              </Button>
              <UserNav />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
