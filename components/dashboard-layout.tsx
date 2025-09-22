"use client"
"use client"

import { useState, useEffect, useMemo } from "react"
import type { ReactNode, KeyboardEvent } from "react"
import { usePathname } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  Clock,
  Building,
  User,
  FileText,
} from "lucide-react"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const pathname = usePathname()
  
  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    // @ts-ignore - Event listener type compatibility
    const handleKeyDown = (e: Event) => {
      const keyEvent = e as KeyboardEvent
      if ((keyEvent.ctrlKey || keyEvent.metaKey) && keyEvent.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])
  
  // Fetch data for search
  const projects = useQuery(api.projects.getProjects) || []
  const clients = useQuery(api.clients.getClients) || []
  const tasks = useQuery(api.tasks.getTasks) || []
  const leads = useQuery(api.leads.getLeads) || []
  
  // Search functionality
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return []
    
    const term = searchTerm.toLowerCase()
    const results: any[] = []
    
    // Search projects
    projects.forEach(project => {
      if (
        project.title?.toLowerCase().includes(term) ||
        project.description?.toLowerCase().includes(term) ||
        project.status?.toLowerCase().includes(term)
      ) {
        results.push({
          type: 'project',
          id: project._id,
          title: project.title,
          subtitle: `Project • ${project.status}`,
          description: project.description,
          icon: FolderOpen,
          href: '/projects'
        })
      }
    })
    
    // Search clients
    clients.forEach(client => {
      if (
        client.name?.toLowerCase().includes(term) ||
        client.email?.toLowerCase().includes(term) ||
        client.company?.toLowerCase().includes(term)
      ) {
        results.push({
          type: 'client',
          id: client._id,
          title: client.name,
          subtitle: `Client • ${client.status || 'Active'}`,
          description: client.company || client.email,
          icon: User,
          href: '/clients'
        })
      }
    })
    
    // Search tasks
    tasks.forEach(task => {
      if (
        task.title?.toLowerCase().includes(term) ||
        task.description?.toLowerCase().includes(term) ||
        task.status?.toLowerCase().includes(term)
      ) {
        results.push({
          type: 'task',
          id: task._id,
          title: task.title,
          subtitle: `Task • ${task.status} • ${task.priority} priority`,
          description: task.description,
          icon: CheckSquare,
          href: '/projects'
        })
      }
    })
    
    // Search leads
    leads.forEach(lead => {
      if (
        lead.name?.toLowerCase().includes(term) ||
        lead.email?.toLowerCase().includes(term) ||
        lead.company?.toLowerCase().includes(term) ||
        lead.status?.toLowerCase().includes(term)
      ) {
        results.push({
          type: 'lead',
          id: lead._id,
          title: lead.name,
          subtitle: `Lead • ${lead.status}`,
          description: lead.company || lead.email,
          icon: Users,
          href: '/crm'
        })
      }
    })
    
    return results.slice(0, 10) // Limit to 10 results
  }, [searchTerm, projects, clients, tasks, leads])
  
  const handleSearchSelect = (result: any) => {
    setSearchOpen(false)
    setSearchTerm("")
    // Navigate to the appropriate page
    window.location.href = result.href
  }
  
  const handleSearchKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchOpen(false)
      setSearchTerm("")
    }
    if (e.key === 'Enter' && searchResults.length > 0) {
      handleSearchSelect(searchResults[0])
    }
  }

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
              <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
                <DialogTrigger asChild>
                  <div className="relative cursor-pointer" onClick={() => setSearchOpen(true)}>
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search projects, clients, tasks... (⌘K)"
                      className="pl-10 pr-4 py-2 w-80 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                      readOnly
                    />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>Search</DialogTitle>
                    <DialogDescription>Search across projects, clients, tasks, and leads</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Type to search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        className="pl-10"
                        autoFocus
                      />
                    </div>
                    
                    {searchTerm && (
                      <div className="max-h-96 overflow-y-auto space-y-2">
                        {searchResults.length > 0 ? (
                          searchResults.map((result) => (
                            <div
                              key={`${result.type}-${result.id}`}
                              className="p-3 rounded-lg border border-border hover:bg-accent cursor-pointer transition-colors"
                              onClick={() => handleSearchSelect(result)}
                            >
                              <div className="flex items-start gap-3">
                                <result.icon className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm truncate">{result.title}</h4>
                                  <p className="text-xs text-muted-foreground">{result.subtitle}</p>
                                  {result.description && (
                                    <p className="text-xs text-muted-foreground mt-1 truncate">
                                      {result.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No results found for "{searchTerm}"</p>
                            <p className="text-xs mt-1">Try searching for projects, clients, tasks, or leads</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {!searchTerm && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Start typing to search</p>
                        <p className="text-xs mt-1">Search across projects, clients, tasks, and leads</p>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
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
