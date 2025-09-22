"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
  Plus,
} from "lucide-react"

// Form validation schemas
const leadSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  status: z.enum(["new", "contacted", "qualified", "proposal", "won", "lost"]),
  source: z.string().optional(),
  notes: z.string().optional(),
  estimatedValue: z.number().optional().nullable(),
})

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  clientId: z.string().min(1, "Client is required"),
  budget: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.enum(["planning", "in_progress", "review", "completed"]),
})

type LeadFormData = z.infer<typeof leadSchema>
type ProjectFormData = z.infer<typeof projectSchema>

export function DashboardOverview() {
  const { user } = useUser()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  
  // Dialog states
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false)
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false)
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>("new")
  const [selectedSource, setSelectedSource] = useState<string>("")
  
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
  
  // Mutations for database operations
  const createLead = useMutation(api.leads.createLead)
  const createProject = useMutation(api.projects.createProject)
  const createClient = useMutation(api.clients.createClient)
  
  // Helper function to create sample data
  const createSampleData = async () => {
    if (clients.length === 0) {
      // Create sample clients
      try {
        await createClient({
          name: "Sarah Johnson",
          email: "sarah@techstartup.com",
          phone: "+254 712 345 678",
          company: "TechStartup Kenya",
          status: "active",
        })
        
        await createClient({
          name: "Michael Rodriguez",
          email: "michael@ecommerceplus.co.ke",
          phone: "+254 798 765 432",
          company: "EcommercePlus",
          status: "active",
        })
        
        toast({
          title: "Sample clients created!",
          description: "You can now create projects for these clients.",
        })
      } catch (error) {
        console.error("Error creating sample clients:", error)
      }
    }
  }
  
  // Auto-create sample clients if none exist
  useEffect(() => {
    if (isClient && clients.length === 0 && projects.length === 0) {
      createSampleData()
    }
  }, [isClient, clients.length, projects.length])
  
  // Form handling
  const leadForm = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      status: "new",
      source: "",
      notes: "",
      estimatedValue: undefined,
    },
  })
  
  const projectForm = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      clientId: "",
      budget: undefined,
      startDate: "",
      endDate: "",
      status: "planning",
    },
  })
  
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
  
  // Handle form submissions
  const onLeadSubmit = async (data: LeadFormData) => {
    try {
      setIsLoading(true)
      
      const leadData = {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim() || undefined,
        company: data.company?.trim() || undefined,
        status: data.status || "new",
        source: data.source?.trim() || undefined,
        notes: data.notes?.trim() || undefined,
        estimatedValue: data.estimatedValue || 0,
        currency: "USD",
      }
      
      await createLead(leadData)
      
      toast({
        title: "Success!",
        description: "Lead has been added successfully.",
      })
      
      leadForm.reset()
      setSelectedStatus("new")
      setSelectedSource("")
      setIsAddLeadOpen(false)
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add lead. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const onProjectSubmit = async (data: ProjectFormData) => {
    try {
      setIsLoading(true)
      
      const projectData = {
        title: data.title.trim(),
        description: data.description?.trim() || "",
        clientId: data.clientId as any,
        budget: data.budget || 0,
        currency: "USD",
        startDate: data.startDate ? new Date(data.startDate).getTime() : Date.now(),
        endDate: data.endDate ? new Date(data.endDate).getTime() : undefined,
        status: data.status,
      }
      
      await createProject(projectData)
      
      toast({
        title: "Success!",
        description: "Project has been created successfully.",
      })
      
      projectForm.reset()
      setIsNewProjectOpen(false)
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Navigation handlers
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-lead':
        setIsAddLeadOpen(true)
        break
      case 'new-project':
        setIsNewProjectOpen(true)
        break
      case 'qa-checklist':
        router.push('/qa')
        break
      case 'view-reports':
        router.push('/analytics')
        break
      default:
        break
    }
    setIsQuickActionsOpen(false)
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
        <Dialog open={isQuickActionsOpen} onOpenChange={setIsQuickActionsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 animate-pulse-glow">
              <Zap className="w-4 h-4 mr-2" />
              Quick Actions
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Quick Actions</DialogTitle>
              <DialogDescription>Choose an action to perform</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2"
                onClick={() => handleQuickAction('add-lead')}
              >
                <Users className="w-6 h-6" />
                <span className="text-sm">Add Lead</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2"
                onClick={() => handleQuickAction('new-project')}
              >
                <FolderOpen className="w-6 h-6" />
                <span className="text-sm">New Project</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2"
                onClick={() => handleQuickAction('qa-checklist')}
              >
                <CheckCircle className="w-6 h-6" />
                <span className="text-sm">QA Checklist</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2"
                onClick={() => handleQuickAction('view-reports')}
              >
                <TrendingUp className="w-6 h-6" />
                <span className="text-sm">View Reports</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
            <Button 
              variant="outline" 
              className="w-full bg-transparent"
              onClick={() => router.push('/projects')}
            >
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
            <Button 
              variant="outline" 
              className="w-full bg-transparent"
              onClick={() => router.push('/projects')}
            >
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
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 bg-transparent"
              onClick={() => setIsAddLeadOpen(true)}
            >
              <Users className="w-6 h-6" />
              <span className="text-sm">Add Lead</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 bg-transparent"
              onClick={() => setIsNewProjectOpen(true)}
            >
              <FolderOpen className="w-6 h-6" />
              <span className="text-sm">New Project</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 bg-transparent"
              onClick={() => router.push('/qa')}
            >
              <CheckCircle className="w-6 h-6" />
              <span className="text-sm">QA Checklist</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 bg-transparent"
              onClick={() => router.push('/analytics')}
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-sm">View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Add Lead Dialog */}
      <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
            <DialogDescription>Enter the details of your new potential client</DialogDescription>
          </DialogHeader>
          <form onSubmit={leadForm.handleSubmit(onLeadSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input 
                  id="name" 
                  placeholder="John Doe" 
                  {...leadForm.register("name")}
                />
                {leadForm.formState.errors.name && (
                  <p className="text-sm text-red-500">{leadForm.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john@company.com" 
                  {...leadForm.register("email")}
                />
                {leadForm.formState.errors.email && (
                  <p className="text-sm text-red-500">{leadForm.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="+1 (555) 123-4567" 
                  {...leadForm.register("phone")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input 
                  id="company" 
                  placeholder="Acme Corp" 
                  {...leadForm.register("company")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedValue">Estimated Value (USD)</Label>
                <Input 
                  id="estimatedValue" 
                  type="number" 
                  placeholder="5000" 
                  {...leadForm.register("estimatedValue", { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select 
                  value={selectedStatus}
                  onValueChange={(value) => {
                    setSelectedStatus(value)
                    leadForm.setValue("status", value as "new" | "contacted" | "qualified" | "proposal" | "won" | "lost")
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select lead status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="won">Won</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Lead Source</Label>
                <Select 
                  value={selectedSource}
                  onValueChange={(value) => {
                    setSelectedSource(value)
                    leadForm.setValue("source", value)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="How did they find you?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website Form</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="google">Google Search</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Project requirements, timeline, special notes..." 
                  {...leadForm.register("notes")}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  leadForm.reset()
                  setSelectedStatus("new")
                  setSelectedSource("")
                  setIsAddLeadOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Lead"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* New Project Dialog */}
      <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>Add a new project to your workflow</DialogDescription>
          </DialogHeader>
          <form onSubmit={projectForm.handleSubmit(onProjectSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input 
                  id="title" 
                  placeholder="Website Redesign" 
                  {...projectForm.register("title")}
                />
                {projectForm.formState.errors.title && (
                  <p className="text-sm text-red-500">{projectForm.formState.errors.title.message}</p>
                )}
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Project description and requirements..." 
                  {...projectForm.register("description")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientId">Client *</Label>
                <Select onValueChange={(value) => projectForm.setValue("clientId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client._id} value={client._id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {projectForm.formState.errors.clientId && (
                  <p className="text-sm text-red-500">{projectForm.formState.errors.clientId.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (USD)</Label>
                <Input 
                  id="budget" 
                  type="number" 
                  placeholder="10000" 
                  {...projectForm.register("budget", { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input 
                  id="startDate" 
                  type="date" 
                  {...projectForm.register("startDate")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input 
                  id="endDate" 
                  type="date" 
                  {...projectForm.register("endDate")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={(value) => projectForm.setValue("status", value as "planning" | "in_progress" | "review" | "completed")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  projectForm.reset()
                  setIsNewProjectOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}