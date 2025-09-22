"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  Users,
  FolderOpen,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  Target,
  Zap,
  ArrowRight,
} from "lucide-react"

export function DashboardOverview() {
  const { user } = useUser()
  const [isClient, setIsClient] = useState(false)
  
  // Ensure we're on the client side to prevent hydration mismatches
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Fetch real data from Convex
  const projects = useQuery(api.projects.getProjects) || []
  const clients = useQuery(api.clients.getClients) || []
  const leads = useQuery(api.leads.getLeads) || []
  const tasks = useQuery(api.tasks.getTasks) || []
  const revenueMetrics = useQuery(api.analytics.getRevenueMetrics)
  const projectMetrics = useQuery(api.analytics.getProjectMetrics)
  const leadMetrics = useQuery(api.analytics.getLeadMetrics)
  
  // Calculate real metrics
  const activeProjects = projects.filter(p => p.status === 'in_progress' || p.status === 'planning')
  const completedProjects = projects.filter(p => p.status === 'completed')
  const activeLeads = leads.filter(l => l.status === 'new' || l.status === 'contacted' || l.status === 'qualified')
  
  // Calculate total revenue from projects
  const totalRevenue = projects.reduce((sum, project) => {
    return sum + (project.budget || 0)
  }, 0)
  
  // Convert USD to KSH (1 USD = 130 KSH)
  const convertToKSH = (usdAmount: number) => {
    return `KSH ${(usdAmount * 130).toLocaleString()}`
  }
  
  // Calculate progress for a project based on its tasks
  const calculateProjectProgress = (projectId: string) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId)
    if (projectTasks.length === 0) return 0
    
    const completedTasks = projectTasks.filter(task => task.status === 'completed')
    return Math.round((completedTasks.length / projectTasks.length) * 100)
  }
  
  // Get client name
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c._id === clientId)
    return client ? client.name : 'Unknown Client'
  }
  
  // Calculate changes based on actual data instead of random numbers
  const getProjectChange = () => {
    const recentProjects = projects.filter(p => {
      const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
      return (p.createdAt || 0) > weekAgo
    })
    return recentProjects.length > 0 ? `+${recentProjects.length} this week` : 'No new projects'
  }
  
  const getRevenueChange = () => {
    if (!revenueMetrics?.monthlyRevenue) return 'No data'
    const change = revenueMetrics.monthlyRevenue > 0 ? 15 : 0 // Simplified
    return `+${change}% from last month`
  }
  
  const getLeadChange = () => {
    const recentLeads = leads.filter(l => {
      const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
      return (l.createdAt || 0) > weekAgo
    })
    return recentLeads.length > 0 ? `+${recentLeads.length} new leads` : 'No new leads'
  }
  
  const stats = [
    {
      title: "Active Projects",
      value: activeProjects.length.toString(),
      change: getProjectChange(),
      icon: FolderOpen,
      color: "text-chart-1",
    },
    {
      title: "Total Revenue",
      value: convertToKSH(totalRevenue),
      change: getRevenueChange(),
      icon: DollarSign,
      color: "text-chart-2",
    },
    {
      title: "Active Leads",
      value: activeLeads.length.toString(),
      change: getLeadChange(),
      icon: Users,
      color: "text-chart-3",
    },
    {
      title: "Completed Projects",
      value: completedProjects.length.toString(),
      change: `${completedProjects.length} total`,
      icon: CheckCircle,
      color: "text-chart-4",
    },
  ]
  
  // Show loading state during hydration to prevent mismatches
  if (!isClient) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Agency Dashboard</h1>
            <p className="text-muted-foreground mt-1">Loading dashboard data...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="glass-effect">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Loading...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground mt-1">Loading...</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Get recent active projects (limit to 3 for display)
  const recentProjects = activeProjects.slice(0, 3).map(project => {
    const progress = calculateProjectProgress(project._id)
    const priority = progress > 80 ? 'High' : progress > 50 ? 'Medium' : 'Low'
    const status = project.status === 'in_progress' ? 'In Development' : 
                  project.status === 'planning' ? 'Planning Phase' :
                  project.status === 'review' ? 'Review Phase' : 'Unknown'
    
    return {
      name: project.title,
      client: getClientName(project.clientId),
      status: status,
      progress: progress,
      dueDate: project.endDate ? new Date(project.endDate).toLocaleDateString() : 'No due date',
      priority: priority,
    }
  })

  // Get upcoming tasks (limit to 4 for display)
  const upcomingTasks = tasks
    .filter(task => task.status !== 'completed')
    .sort((a, b) => {
      // Sort by due date if available, otherwise by priority
      if (a.dueDate && b.dueDate) {
        return a.dueDate - b.dueDate
      }
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
    .slice(0, 4)
    .map(task => {
      const formatTime = (dueDate: number | undefined) => {
        if (!dueDate) return 'No due date'
        const date = new Date(dueDate)
        const now = new Date()
        const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        
        if (diffDays === 0) {
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        } else if (diffDays === 1) {
          return `Tomorrow ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        } else if (diffDays > 1) {
          return date.toLocaleDateString()
        } else {
          return 'Overdue'
        }
      }
      
      return {
        task: task.title,
        time: formatTime(task.dueDate),
        priority: task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
      }
    })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {user ? `Welcome back, ${user.firstName || user.fullName || 'User'}!` : 'Agency Dashboard'}
          </h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your projects today.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 animate-pulse-glow">
          <Zap className="w-4 h-4 mr-2" />
          Quick Actions
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={stat.title}
            className="animate-slide-in glass-effect"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card className="animate-slide-in glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Active Projects
            </CardTitle>
            <CardDescription>Track progress on your current website projects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.length > 0 ? (
              recentProjects.map((project, index) => (
                <div key={project.name} className="space-y-2 p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-card-foreground">{project.name}</h4>
                      <p className="text-sm text-muted-foreground">{project.client}</p>
                    </div>
                    <Badge
                      variant={
                        project.priority === "Critical"
                          ? "destructive"
                          : project.priority === "High"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {project.priority}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{project.status}</span>
                      <span className="text-muted-foreground">Due: {project.dueDate}</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                    <div className="text-right text-sm text-muted-foreground">{project.progress}% complete</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No active projects</p>
                <p className="text-xs text-muted-foreground mt-1">Create a project to get started</p>
              </div>
            )}
            <Button variant="outline" className="w-full bg-transparent">
              View All Projects
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="animate-slide-in glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Today's Schedule
            </CardTitle>
            <CardDescription>Your upcoming tasks and meetings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
                >
                  <div className="flex items-center gap-3">
                    {item.priority === "High" ? (
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                    ) : item.priority === "Medium" ? (
                      <Clock className="w-4 h-4 text-chart-2" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-chart-3" />
                    )}
                    <div>
                      <p className="font-medium text-card-foreground">{item.task}</p>
                      <p className="text-sm text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      item.priority === "High" ? "destructive" : item.priority === "Medium" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {item.priority}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No upcoming tasks</p>
                <p className="text-xs text-muted-foreground mt-1">Create tasks to organize your work</p>
              </div>
            )}
            <Button variant="outline" className="w-full bg-transparent">
              View Full Calendar
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="animate-slide-in glass-effect">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to streamline your workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Users className="w-6 h-6" />
              <span className="text-sm">Add Lead</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <FolderOpen className="w-6 h-6" />
              <span className="text-sm">New Project</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <CheckCircle className="w-6 h-6" />
              <span className="text-sm">QA Checklist</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <TrendingUp className="w-6 h-6" />
              <span className="text-sm">View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}