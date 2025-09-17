"use client"

import { useState } from "react"
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

interface Task {
  id: string
  title: string
  description: string
  assignee: string
  priority: "Low" | "Medium" | "High" | "Critical"
  dueDate: string
  status: "Discovery" | "Planning" | "Design" | "Development" | "QA" | "Launch"
  tags: string[]
}

interface Project {
  id: string
  name: string
  client: string
  status: "Discovery" | "Planning" | "Design" | "Development" | "QA" | "Launch"
  progress: number
  startDate: string
  dueDate: string
  budget: string
  team: string[]
  tasks: Task[]
}

export function ProjectWorkflow() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "TechCorp Website Redesign",
      client: "TechCorp Inc.",
      status: "Development",
      progress: 75,
      startDate: "2024-01-01",
      dueDate: "2024-01-15",
      budget: "KSH 8,450,000",
      team: ["John Doe", "Sarah Smith", "Mike Johnson"],
      tasks: [
        {
          id: "t1",
          title: "Homepage wireframe",
          description: "Create wireframe for new homepage layout",
          assignee: "Sarah Smith",
          priority: "High",
          dueDate: "2024-01-12",
          status: "Design",
          tags: ["wireframe", "homepage"],
        },
        {
          id: "t2",
          title: "Backend API development",
          description: "Develop REST API for content management",
          assignee: "Mike Johnson",
          priority: "Critical",
          dueDate: "2024-01-14",
          status: "Development",
          tags: ["backend", "api"],
        },
      ],
    },
    {
      id: "2",
      name: "E-commerce Platform",
      client: "ShopMart",
      status: "QA",
      progress: 90,
      startDate: "2023-12-15",
      dueDate: "2024-01-10",
      budget: "KSH 5,850,000",
      team: ["John Doe", "Emily Chen"],
      tasks: [
        {
          id: "t3",
          title: "Payment integration testing",
          description: "Test Stripe payment integration",
          assignee: "Emily Chen",
          priority: "Critical",
          dueDate: "2024-01-09",
          status: "QA",
          tags: ["payment", "testing"],
        },
      ],
    },
  ])

  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0])
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)

  const statusColumns = [
    { id: "Discovery", title: "Discovery", icon: FileText, color: "bg-blue-500" },
    { id: "Planning", title: "Planning", icon: Calendar, color: "bg-purple-500" },
    { id: "Design", title: "Design", icon: ImageIcon, color: "bg-pink-500" },
    { id: "Development", title: "Development", icon: Code, color: "bg-green-500" },
    { id: "QA", title: "QA Testing", icon: TestTube, color: "bg-yellow-500" },
    { id: "Launch", title: "Launch", icon: Rocket, color: "bg-red-500" },
  ]

  const priorityColors = {
    Low: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    Medium: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    High: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    Critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
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
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="task-title">Task Title</Label>
                <Input id="task-title" placeholder="Enter task title" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="task-description">Description</Label>
                <Textarea id="task-description" placeholder="Describe the task requirements..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignee">Assignee</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john">John Doe</SelectItem>
                    <SelectItem value="sarah">Sarah Smith</SelectItem>
                    <SelectItem value="mike">Mike Johnson</SelectItem>
                    <SelectItem value="emily">Emily Chen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="due-date">Due Date</Label>
                <Input id="due-date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Discovery">Discovery</SelectItem>
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="QA">QA Testing</SelectItem>
                    <SelectItem value="Launch">Launch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddTaskOpen(false)}>Create Task</Button>
            </div>
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
