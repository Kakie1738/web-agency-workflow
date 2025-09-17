"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import {
  FolderOpen,
  Plus,
  Calendar,
  User,
  Clock,
  FileText,
  ImageIcon,
  Code,
  TestTube,
  Rocket,
  MoreHorizontal,
} from "lucide-react"

// Task form validation schema
const taskSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  projectId: z.string().optional(),
  assignedTo: z.string().optional(),
  status: z.enum(["todo", "in_progress", "review", "completed"]),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().optional(),
})

type TaskFormData = z.infer<typeof taskSchema>

export function ProjectWorkflow() {
  // Fetch data from Convex
  const projects = useQuery(api.projects.getProjects) || []
  const tasks = useQuery(api.tasks.getTasks) || []
  const clients = useQuery(api.clients.getClients) || []
  
  // Mutations
  const createTask = useMutation(api.tasks.createTask)
  const updateTask = useMutation(api.tasks.updateTask)
  const deleteTask = useMutation(api.tasks.deleteTask)
  
  const [selectedProject, setSelectedProject] = useState(projects[0])
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Form handling
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      projectId: "",
      assignedTo: "",
      status: "todo",
      priority: "medium",
      dueDate: "",
    },
  })

  const statusColumns = [
    { id: "todo", title: "To Do", icon: FileText, color: "bg-blue-500" },
    { id: "in_progress", title: "In Progress", icon: Code, color: "bg-green-500" },
    { id: "review", title: "Review", icon: TestTube, color: "bg-yellow-500" },
    { id: "completed", title: "Completed", icon: Rocket, color: "bg-purple-500" },
  ]

  const priorityColors = {
    low: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    medium: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  }
  
  // Currency conversion from USD to KSH (1 USD = 130 KSH)
  const convertToKSH = (usdAmount: number) => {
    return `KSH ${(usdAmount * 130).toLocaleString()}`
  }
  
  // Handle task creation
  const onSubmit = async (data: TaskFormData) => {
    try {
      setIsLoading(true)
      await createTask({
        title: data.title,
        description: data.description,
        projectId: data.projectId ? (data.projectId as any) : undefined,
        assignedTo: data.assignedTo,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate).getTime() : undefined,
      })
      
      toast({
        title: "Success!",
        description: "Task has been created successfully.",
      })
      
      form.reset()
      setIsAddTaskOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Get client name for project
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c._id === clientId)
    return client ? client.name : "Unknown Client"
  }
  
  // Calculate project progress
  const calculateProgress = (projectId: string) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId)
    if (projectTasks.length === 0) return 0
    
    const completedTasks = projectTasks.filter(task => task.status === "completed")
    return Math.round((completedTasks.length / projectTasks.length) * 100)
  }

  const getTasksByStatus = (status: string) => {
    return selectedProject?.tasks.filter((task) => task.status === status) || []
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Project Workflow</h1>
          <p className="text-muted-foreground mt-1">Manage your website development projects with Kanban boards</p>
        </div>
        <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 animate-pulse-glow">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>Create a new task for the selected project</DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="task-title">Task Title *</Label>
                  <Input 
                    id="task-title" 
                    placeholder="Enter task title" 
                    {...form.register("title")}
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                  )}
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="task-description">Description</Label>
                  <Textarea 
                    id="task-description" 
                    placeholder="Describe the task requirements..." 
                    {...form.register("description")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project">Project</Label>
                  <Select onValueChange={(value) => form.setValue("projectId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project._id} value={project._id}>
                          {project.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Input 
                    id="assignee" 
                    placeholder="Team member name" 
                    {...form.register("assignedTo")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select onValueChange={(value) => form.setValue("priority", value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input 
                    id="due-date" 
                    type="date" 
                    {...form.register("dueDate")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select onValueChange={(value) => form.setValue("status", value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
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
                    setIsAddTaskOpen(false)
                    form.reset()
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Task"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Project Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-lg">Active Projects</CardTitle>
            <CardDescription>Select a project to manage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedProject?.id === project.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedProject(project)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{project.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {project.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{project.client}</p>
                <Progress value={project.progress} className="h-1" />
                <p className="text-xs text-muted-foreground mt-1">{project.progress}% complete</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Kanban Board */}
        <div className="lg:col-span-3">
          {selectedProject && (
            <Card className="glass-effect">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FolderOpen className="w-5 h-5 text-primary" />
                      {selectedProject.name}
                    </CardTitle>
                    <CardDescription>
                      {selectedProject.client} • Due: {selectedProject.dueDate} • Budget: {selectedProject.budget}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{selectedProject.status}</Badge>
                    <span className="text-sm text-muted-foreground">{selectedProject.progress}% complete</span>
                  </div>
                </div>
                <Progress value={selectedProject.progress} className="mt-2" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  {statusColumns.map((column) => (
                    <div key={column.id} className="space-y-3">
                      <div className="flex items-center gap-2 pb-2 border-b border-border">
                        <div className={`w-3 h-3 rounded-full ${column.color}`} />
                        <h3 className="font-medium text-sm">{column.title}</h3>
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {getTasksByStatus(column.id).length}
                        </Badge>
                      </div>
                      <div className="space-y-2 min-h-[200px]">
                        {getTasksByStatus(column.id).map((task) => (
                          <Card key={task.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                            <div className="space-y-2">
                              <div className="flex items-start justify-between">
                                <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <MoreHorizontal className="w-3 h-3" />
                                </Button>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                              <div className="flex items-center justify-between">
                                <Badge className={priorityColors[task.priority]} variant="secondary">
                                  {task.priority}
                                </Badge>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Calendar className="w-3 h-3" />
                                  {task.dueDate}
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <User className="w-3 h-3" />
                                  {task.assignee}
                                </div>
                                <div className="flex gap-1">
                                  {task.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Project Stats */}
      {selectedProject && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-effect">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Tasks</p>
                  <p className="text-2xl font-bold">{selectedProject.tasks.length}</p>
                </div>
                <FileText className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="glass-effect">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Team Members</p>
                  <p className="text-2xl font-bold">{selectedProject.team.length}</p>
                </div>
                <User className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="glass-effect">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Days Remaining</p>
                  <p className="text-2xl font-bold">
                    {Math.ceil(
                      (new Date(selectedProject.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                    )}
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
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="text-2xl font-bold">{selectedProject.budget}</p>
                </div>
                <FolderOpen className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
