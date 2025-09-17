"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../convex/_generated/api"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import {
  MessageSquare,
  FileText,
  Upload,
  Download,
  DollarSign,
  Clock,
  CheckCircle,
  Send,
  Paperclip,
  Eye,
  Star,
  Plus,
  Users,
} from "lucide-react"

// Client form validation schema
const clientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  status: z.enum(["active", "inactive", "pending"]),
})

// Project form validation schema
const projectSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  clientId: z.string().min(1, "Please select a client"),
  status: z.enum(["planning", "in_progress", "review", "completed", "on_hold"]),
  budget: z.number().optional(),
  currency: z.string().default("USD"),
})

type ClientFormData = z.infer<typeof clientSchema>
type ProjectFormData = z.infer<typeof projectSchema>

export function ClientPortalConvex() {
  // Fetch data using Convex reactive queries
  const projects = useQuery(api.projects.getProjects) || []
  const clients = useQuery(api.clients.getClients) || []
  const analytics = useQuery(api.analytics.getProjectMetrics)
  
  // Mutations for creating/updating data
  const createProject = useMutation(api.projects.createProject)
  const updateProject = useMutation(api.projects.updateProject)
  const createClient = useMutation(api.clients.createClient)
  const recordRevenue = useMutation(api.analytics.recordRevenue)
  
  const [selectedProject, setSelectedProject] = useState(projects[0])
  const [newMessage, setNewMessage] = useState("")
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isAddClientOpen, setIsAddClientOpen] = useState(false)
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Form handling
  const clientForm = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      status: "active",
    },
  })
  
  const projectForm = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      clientId: "",
      status: "planning",
      budget: 0,
      currency: "USD",
    },
  })

  const statusColors = {
    planning: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    in_progress: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    review: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
    on_hold: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  // Calculate project progress based on status
  const getProjectProgress = (status: string) => {
    const progressMap = {
      planning: 20,
      in_progress: 60,
      review: 85,
      completed: 100,
      on_hold: 50,
    }
    return progressMap[status as keyof typeof progressMap] || 0
  }

  // Currency conversion from USD to KSH (1 USD = 130 KSH)
  const convertToKSH = (usdAmount: number) => {
    return `KSH ${(usdAmount * 130).toLocaleString()}`
  }

  // Handle project update
  const handleProjectUpdate = async (projectId: string, updates: any) => {
    try {
      await updateProject({ id: projectId as any, ...updates })
      toast({
        title: "Success!",
        description: "Project updated successfully.",
      })
    } catch (error) {
      console.error('Failed to update project:', error)
      toast({
        title: "Error",
        description: "Failed to update project.",
        variant: "destructive",
      })
    }
  }
  
  // Handle client creation
  const onClientSubmit = async (data: ClientFormData) => {
    try {
      setIsLoading(true)
      await createClient({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        status: data.status,
      })
      
      toast({
        title: "Success!",
        description: "Client has been added to the database.",
      })
      
      clientForm.reset()
      setIsAddClientOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add client. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle project creation
  const onProjectSubmit = async (data: ProjectFormData) => {
    try {
      setIsLoading(true)
      await createProject({
        title: data.title,
        description: data.description,
        clientId: data.clientId as any,
        status: data.status,
        budget: data.budget,
        currency: data.currency,
      })
      
      toast({
        title: "Success!",
        description: "Project has been created successfully.",
      })
      
      projectForm.reset()
      setIsAddProjectOpen(false)
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

  if (!projects.length) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h3 className="text-lg font-medium">No projects found</h3>
          <p className="text-muted-foreground">Your projects will appear here once they're created.</p>
        </div>
      </div>
    )
  }

  const currentProject = selectedProject || projects[0]
  const progress = getProjectProgress(currentProject.status)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Client Portal</h1>
          <p className="text-muted-foreground mt-1">Track your project progress with real-time updates</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
                <DialogDescription>Create a new client in your database</DialogDescription>
              </DialogHeader>
              <form onSubmit={clientForm.handleSubmit(onClientSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-name">Name *</Label>
                    <Input 
                      id="client-name" 
                      placeholder="John Doe" 
                      {...clientForm.register("name")}
                    />
                    {clientForm.formState.errors.name && (
                      <p className="text-sm text-red-500">{clientForm.formState.errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-email">Email *</Label>
                    <Input 
                      id="client-email" 
                      type="email" 
                      placeholder="john@company.com" 
                      {...clientForm.register("email")}
                    />
                    {clientForm.formState.errors.email && (
                      <p className="text-sm text-red-500">{clientForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-phone">Phone</Label>
                    <Input 
                      id="client-phone" 
                      placeholder="+1 (555) 123-4567" 
                      {...clientForm.register("phone")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-company">Company</Label>
                    <Input 
                      id="client-company" 
                      placeholder="Company Inc." 
                      {...clientForm.register("company")}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="client-status">Status</Label>
                    <Select onValueChange={(value) => clientForm.setValue("status", value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsAddClientOpen(false)
                      clientForm.reset()
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add Client"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>Add a new project to your workflow</DialogDescription>
              </DialogHeader>
              <form onSubmit={projectForm.handleSubmit(onProjectSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="project-title">Project Title *</Label>
                    <Input 
                      id="project-title" 
                      placeholder="Website Redesign" 
                      {...projectForm.register("title")}
                    />
                    {projectForm.formState.errors.title && (
                      <p className="text-sm text-red-500">{projectForm.formState.errors.title.message}</p>
                    )}
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="project-description">Description</Label>
                    <Textarea 
                      id="project-description" 
                      placeholder="Project description and requirements..." 
                      {...projectForm.register("description")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-client">Client *</Label>
                    <Select onValueChange={(value) => projectForm.setValue("clientId", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client._id} value={client._id}>
                            {client.name} - {client.company || client.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {projectForm.formState.errors.clientId && (
                      <p className="text-sm text-red-500">{projectForm.formState.errors.clientId.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-budget">Budget (USD)</Label>
                    <Input 
                      id="project-budget" 
                      type="number" 
                      placeholder="50000" 
                      {...projectForm.register("budget", { valueAsNumber: true })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsAddProjectOpen(false)
                      projectForm.reset()
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
          
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Files</DialogTitle>
                <DialogDescription>Share files with your development team</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">Drag and drop files here, or click to browse</p>
                  <Button variant="outline" size="sm">
                    Choose Files
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file-description">Description (optional)</Label>
                  <Textarea id="file-description" placeholder="Brief description of the files..." />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsUploadOpen(false)}>Upload Files</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button className="bg-primary hover:bg-primary/90 animate-pulse-glow">
            <Star className="w-4 h-4 mr-2" />
            Leave Review
          </Button>
        </div>
      </div>

      {/* Project Selection */}
      {projects.length > 1 && (
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Select Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div
                  key={project._id}
                  onClick={() => setSelectedProject(project)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedProject?._id === project._id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <h4 className="font-medium">{project.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                      {project.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {project.budget ? convertToKSH(project.budget) : 'No budget set'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project Overview */}
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                {currentProject.title}
              </CardTitle>
              <CardDescription>{currentProject.description}</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={statusColors[currentProject.status as keyof typeof statusColors]}>
                {currentProject.status.replace('_', ' ')}
              </Badge>
              <span className="text-sm text-muted-foreground">{progress}% complete</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Project Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-effect">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Budget</p>
                <p className="text-2xl font-bold">
                  {currentProject.budget ? convertToKSH(currentProject.budget) : 'TBD'}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-effect">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Days Remaining</p>
                <p className="text-2xl font-bold">
                  {currentProject.endDate 
                    ? Math.max(0, Math.ceil((currentProject.endDate - Date.now()) / (1000 * 60 * 60 * 24)))
                    : 'TBD'
                  }
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-effect">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{analytics?.total || 0}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-effect">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{analytics?.completed || 0}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Project Updates */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Project Status</CardTitle>
          <CardDescription>Real-time updates from Convex database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <h4 className="font-medium">Current Phase</h4>
                <p className="text-sm text-muted-foreground">
                  Your project is currently in the {currentProject.status.replace('_', ' ')} phase
                </p>
              </div>
              <Badge className={statusColors[currentProject.status as keyof typeof statusColors]}>
                {currentProject.status.replace('_', ' ')}
              </Badge>
            </div>
            
            {currentProject.startDate && (
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <h4 className="font-medium">Start Date</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(currentProject.startDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
            
            {currentProject.endDate && (
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <h4 className="font-medium">Expected Completion</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(currentProject.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Interactive Actions */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Interact with your project data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              onClick={() => handleProjectUpdate(currentProject._id, { status: 'review' })}
              disabled={currentProject.status === 'review' || currentProject.status === 'completed'}
            >
              Request Review
            </Button>
            <Button 
              variant="outline"
              onClick={async () => {
                if (currentProject.budget) {
                  await recordRevenue({
                    amount: currentProject.budget,
                    currency: currentProject.currency || 'USD',
                    projectId: currentProject._id,
                    description: `Revenue from ${currentProject.title}`
                  })
                }
              }}
            >
              Record Payment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}