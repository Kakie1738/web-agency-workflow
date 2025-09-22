"use client"

import { useState, useEffect } from "react"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  Edit,
  Trash2,
  Eye,
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
  const projects = useQuery(api.projects.getProjects)
  const tasks = useQuery(api.tasks.getTasks)
  const clients = useQuery(api.clients.getClients)
  
  // Debug logging with more detail
  console.log("ProjectWorkflow - Raw projects query result:", projects)
  console.log("ProjectWorkflow - Raw tasks query result:", tasks)
  console.log("ProjectWorkflow - Raw clients query result:", clients)
  console.log("ProjectWorkflow - Projects loading status:", projects === undefined ? "Loading" : "Loaded")
  
  // Handle loading state
  const isLoading = projects === undefined || tasks === undefined || clients === undefined
  const projectsList = projects || []
  const tasksList = tasks || []
  const clientsList = clients || []
  
  console.log("ProjectWorkflow - Final arrays:", { 
    projectsCount: projectsList.length, 
    tasksCount: tasksList.length, 
    clientsCount: clientsList.length 
  })
  
  // Mutations
  const createTask = useMutation(api.tasks.createTask)
  const updateTask = useMutation(api.tasks.updateTask)
  const deleteTask = useMutation(api.tasks.deleteTask)
  
  const [selectedProject, setSelectedProject] = useState(projectsList[0])
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isCreateLoading, setIsCreateLoading] = useState(false)
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false)
  const [isViewTaskOpen, setIsViewTaskOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  
  // Update selected project when projects change
  useEffect(() => {
    if (projectsList.length > 0 && !selectedProject) {
      console.log("Auto-selecting first project:", projectsList[0])
      setSelectedProject(projectsList[0])
    }
  }, [projectsList, selectedProject])
  
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
  
  const editForm = useForm<TaskFormData>({
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
      setIsCreateLoading(true)
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
      setIsCreateLoading(false)
    }
  }
  
  // Handle task editing
  const onEditSubmit = async (data: TaskFormData) => {
    if (!selectedTask) return
    
    try {
      setIsCreateLoading(true)
      await updateTask({
        id: selectedTask._id,
        title: data.title,
        description: data.description,
        assignedTo: data.assignedTo,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate).getTime() : undefined,
      })
      
      toast({
        title: "Success!",
        description: "Task has been updated successfully.",
      })
      
      setIsEditTaskOpen(false)
      setSelectedTask(null)
      editForm.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreateLoading(false)
    }
  }
  
  // Handle task deletion
  const handleDeleteTask = async (taskId: any) => {
    try {
      setIsDeleteLoading(true)
      // @ts-ignore - Convex ID type compatibility
      await deleteTask({ id: taskId } as any)
      
      toast({
        title: "Success!",
        description: "Task has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteLoading(false)
    }
  }
  
  // Handle task actions
  const handleViewTask = (task: any) => {
    setSelectedTask(task)
    setIsViewTaskOpen(true)
  }
  
  const handleEditTask = (task: any) => {
    setSelectedTask(task)
    editForm.reset({
      title: task.title,
      description: task.description || "",
      assignedTo: task.assignedTo || "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
    })
    setIsEditTaskOpen(true)
  }
  
  // Get client name for project
  const getClientName = (clientId: string) => {
    const client = clientsList.find(c => c._id === clientId)
    return client ? client.name : "Unknown Client"
  }
  
  // Calculate project progress
  const calculateProgress = (projectId: string) => {
    const projectTasks = tasksList.filter(task => task.projectId === projectId)
    if (projectTasks.length === 0) return 0
    
    const completedTasks = projectTasks.filter(task => task.status === "completed")
    return Math.round((completedTasks.length / projectTasks.length) * 100)
  }

  // Get tasks by status for selected project
  const getTasksByStatus = (status: string) => {
    if (!selectedProject?._id) return []
    return tasksList.filter(task => task.projectId === selectedProject._id && task.status === status)
  }
  
  // Get project tasks
  const getProjectTasks = (projectId: string) => {
    return tasksList.filter(task => task.projectId === projectId)
  }
  
  // Format date for display
  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return "No due date"
    return new Date(timestamp).toLocaleDateString()
  }
  
  // Format budget
  const formatBudget = (budget: number | undefined, currency: string = "USD") => {
    if (!budget) return "No budget set"
    return `${currency} ${budget.toLocaleString()}`
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Project Workflow</h1>
            <p className="text-muted-foreground mt-1">Loading projects...</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-lg font-medium">Loading project data...</h3>
            <p className="text-muted-foreground">Connecting to database...</p>
          </div>
        </div>
      </div>
    )
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
                      {projectsList.map((project) => (
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
                <Button type="submit" disabled={isCreateLoading}>
                  {isCreateLoading ? "Creating..." : "Create Task"}
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
            {projectsList.length === 0 ? (
              <div className="text-center py-8">
                <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No projects found</p>
                <p className="text-xs text-muted-foreground mt-1">Create a project to get started</p>
                <div className="mt-4">
                  <p className="text-xs text-blue-600">Debug: {projectsList.length} projects loaded</p>
                </div>
              </div>
            ) : (
              projectsList.map((project) => (
                <div
                  key={project._id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedProject?._id === project._id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{project.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{getClientName(project.clientId)}</p>
                  <Progress value={calculateProgress(project._id)} className="h-1" />
                  <p className="text-xs text-muted-foreground mt-1">{calculateProgress(project._id)}% complete</p>
                </div>
              ))
            )}
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
                      {selectedProject.title}
                    </CardTitle>
                    <CardDescription>
                      {getClientName(selectedProject.clientId)} • Due: {formatDate(selectedProject.endDate)} • Budget: {formatBudget(selectedProject.budget, selectedProject.currency)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{selectedProject.status}</Badge>
                    <span className="text-sm text-muted-foreground">{calculateProgress(selectedProject._id)}% complete</span>
                  </div>
                </div>
                <Progress value={calculateProgress(selectedProject._id)} className="mt-2" />
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
                          <Card key={task._id} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                            <div className="space-y-2">
                              <div className="flex items-start justify-between">
                                <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                      <MoreHorizontal className="w-3 h-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-40">
                                    <DropdownMenuItem onClick={() => handleViewTask(task)}>
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleEditTask(task)}>
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit Task
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={() => handleDeleteTask(task._id)}
                                      className="text-destructive focus:text-destructive"
                                      disabled={isDeleteLoading}
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      {isDeleteLoading ? "Deleting..." : "Delete Task"}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">{task.description || "No description"}</p>
                              <div className="flex items-center justify-between">
                                <Badge className={priorityColors[task.priority]} variant="secondary">
                                  {task.priority}
                                </Badge>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Calendar className="w-3 h-3" />
                                  {task.dueDate ? formatDate(task.dueDate) : "No due date"}
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <User className="w-3 h-3" />
                                  {task.assignedTo || "Unassigned"}
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
                  <p className="text-2xl font-bold">{getProjectTasks(selectedProject._id).length}</p>
                </div>
                <FileText className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="glass-effect">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed Tasks</p>
                  <p className="text-2xl font-bold">{tasksList.filter(task => task.projectId === selectedProject._id && task.status === "completed").length}</p>
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
                    {selectedProject.endDate 
                      ? Math.max(0, Math.ceil((selectedProject.endDate - Date.now()) / (1000 * 60 * 60 * 24)))
                      : "∞"
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
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="text-2xl font-bold">{formatBudget(selectedProject.budget, selectedProject.currency)}</p>
                </div>
                <FolderOpen className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* View Task Dialog */}
      <Dialog open={isViewTaskOpen} onOpenChange={setIsViewTaskOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
            <DialogDescription>View task information</DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <div className="p-2 bg-muted rounded-md">{selectedTask.title}</div>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Badge className="w-fit">{selectedTask.status.replace('_', ' ')}</Badge>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  {/* @ts-ignore - Priority color mapping */}
                  <Badge 
                    className={selectedTask?.priority === 'high' ? priorityColors.high : 
                              selectedTask?.priority === 'medium' ? priorityColors.medium : 
                              selectedTask?.priority === 'low' ? priorityColors.low : 
                              "bg-gray-100 text-gray-800"} 
                    variant="secondary"
                  >
                    {selectedTask.priority}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label>Assigned To</Label>
                  <div className="p-2 bg-muted rounded-md">{selectedTask.assignedTo || "Unassigned"}</div>
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <div className="p-2 bg-muted rounded-md">{formatDate(selectedTask.dueDate)}</div>
                </div>
                <div className="space-y-2">
                  <Label>Created</Label>
                  <div className="p-2 bg-muted rounded-md">
                    {new Date(selectedTask.createdAt || selectedTask._creationTime).toLocaleDateString()}
                  </div>
                </div>
              </div>
              {selectedTask.description && (
                <div className="space-y-2">
                  <Label>Description</Label>
                  <div className="p-3 bg-muted rounded-md whitespace-pre-wrap">{selectedTask.description}</div>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsViewTaskOpen(false)}>Close</Button>
            <Button onClick={() => {
              setIsViewTaskOpen(false)
              if (selectedTask) handleEditTask(selectedTask)
            }}>
              Edit Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Edit Task Dialog */}
      <Dialog open={isEditTaskOpen} onOpenChange={setIsEditTaskOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update task information</DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-task-title">Task Title *</Label>
                <Input 
                  id="edit-task-title" 
                  placeholder="Enter task title" 
                  {...editForm.register("title")}
                />
                {editForm.formState.errors.title && (
                  <p className="text-sm text-red-500">{editForm.formState.errors.title.message}</p>
                )}
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-task-description">Description</Label>
                <Textarea 
                  id="edit-task-description" 
                  placeholder="Describe the task requirements..." 
                  {...editForm.register("description")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-assignee">Assignee</Label>
                <Input 
                  id="edit-assignee" 
                  placeholder="Team member name" 
                  {...editForm.register("assignedTo")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select 
                  value={editForm.watch("priority")} 
                  onValueChange={(value) => editForm.setValue("priority", value as any)}
                >
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
                <Label htmlFor="edit-due-date">Due Date</Label>
                <Input 
                  id="edit-due-date" 
                  type="date" 
                  {...editForm.register("dueDate")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={editForm.watch("status")} 
                  onValueChange={(value) => editForm.setValue("status", value as any)}
                >
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
                  setIsEditTaskOpen(false)
                  setSelectedTask(null)
                  editForm.reset()
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreateLoading}>
                {isCreateLoading ? "Updating..." : "Update Task"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
