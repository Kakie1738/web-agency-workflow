"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
} from "lucide-react"

interface Message {
  id: string
  sender: string
  senderType: "client" | "team"
  content: string
  timestamp: string
  attachments?: string[]
}

interface ProjectFile {
  id: string
  name: string
  type: "design" | "document" | "asset" | "deliverable"
  size: string
  uploadedBy: string
  uploadedAt: string
  url: string
}

interface Invoice {
  id: string
  number: string
  amount: string
  status: "Pending" | "Paid" | "Overdue"
  dueDate: string
  description: string
}

interface ClientProject {
  id: string
  name: string
  status: "Discovery" | "Planning" | "Design" | "Development" | "QA" | "Launch" | "Complete"
  progress: number
  startDate: string
  dueDate: string
  budget: string
  description: string
  messages: Message[]
  files: ProjectFile[]
  invoices: Invoice[]
  milestones: {
    name: string
    completed: boolean
    dueDate: string
  }[]
}

export function ClientPortal() {
  const [projects, setProjects] = useState<ClientProject[]>([
    {
      id: "1",
      name: "Website Redesign Project",
      status: "Development",
      progress: 75,
      startDate: "2024-01-01",
      dueDate: "2024-01-15",
      budget: "KSH 8,450,000",
      description: "Complete website redesign with modern UI/UX and e-commerce functionality",
      messages: [
        {
          id: "m1",
          sender: "John Doe",
          senderType: "team",
          content: "Hi Sarah! We've completed the homepage design and would love your feedback.",
          timestamp: "2024-01-08 10:30 AM",
        },
        {
          id: "m2",
          sender: "Sarah Johnson",
          senderType: "client",
          content: "Looks great! I love the new color scheme. Can we adjust the hero section slightly?",
          timestamp: "2024-01-08 2:15 PM",
        },
        {
          id: "m3",
          sender: "John Doe",
          senderType: "team",
          content: "I'll make those adjustments and have an updated version ready by tomorrow.",
          timestamp: "2024-01-08 3:45 PM",
        },
      ],
      files: [
        {
          id: "f1",
          name: "Homepage_Design_v2.figma",
          type: "design",
          size: "2.4 MB",
          uploadedBy: "John Doe",
          uploadedAt: "2024-01-08",
          url: "#",
        },
        {
          id: "f2",
          name: "Brand_Guidelines.pdf",
          type: "document",
          size: "1.8 MB",
          uploadedBy: "Sarah Smith",
          uploadedAt: "2024-01-05",
          url: "#",
        },
        {
          id: "f3",
          name: "Product_Images.zip",
          type: "asset",
          size: "15.2 MB",
          uploadedBy: "Sarah Johnson",
          uploadedAt: "2024-01-03",
          url: "#",
        },
      ],
      invoices: [
        {
          id: "inv1",
          number: "INV-2024-001",
          amount: "KSH 4,225,000",
          status: "Paid",
          dueDate: "2024-01-15",
          description: "50% Project Deposit",
        },
        {
          id: "inv2",
          number: "INV-2024-002",
          amount: "KSH 4,225,000",
          status: "Pending",
          dueDate: "2024-01-30",
          description: "Final Payment",
        },
      ],
      milestones: [
        { name: "Project Discovery", completed: true, dueDate: "2024-01-03" },
        { name: "Design Phase", completed: true, dueDate: "2024-01-08" },
        { name: "Development Phase", completed: false, dueDate: "2024-01-12" },
        { name: "Testing & QA", completed: false, dueDate: "2024-01-14" },
        { name: "Launch", completed: false, dueDate: "2024-01-15" },
      ],
    },
  ])

  const [selectedProject, setSelectedProject] = useState<ClientProject>(projects[0])
  const [newMessage, setNewMessage] = useState("")
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  const statusColors = {
    Discovery: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    Planning: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    Design: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    Development: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    QA: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Launch: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    Complete: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
  }

  const fileTypeIcons = {
    design: "🎨",
    document: "📄",
    asset: "🖼️",
    deliverable: "📦",
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: `m${Date.now()}`,
      sender: "Sarah Johnson",
      senderType: "client",
      content: newMessage,
      timestamp: new Date().toLocaleString(),
    }

    setSelectedProject((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }))

    setNewMessage("")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Client Portal</h1>
          <p className="text-muted-foreground mt-1">Track your project progress and communicate with your team</p>
        </div>
        <div className="flex gap-2">
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

      {/* Project Overview */}
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                {selectedProject.name}
              </CardTitle>
              <CardDescription>{selectedProject.description}</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={statusColors[selectedProject.status]}>{selectedProject.status}</Badge>
              <span className="text-sm text-muted-foreground">{selectedProject.progress}% complete</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Project Progress</span>
              <span>{selectedProject.progress}%</span>
            </div>
            <Progress value={selectedProject.progress} className="h-2" />
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
                <p className="text-2xl font-bold">{selectedProject.budget}</p>
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
                <p className="text-sm text-muted-foreground">Files Shared</p>
                <p className="text-2xl font-bold">{selectedProject.files.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-effect">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Messages</p>
                <p className="text-2xl font-bold">{selectedProject.messages.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Milestones */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Project Milestones</CardTitle>
                <CardDescription>Track major project phases and deliverables</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedProject.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          milestone.completed
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {milestone.completed ? <CheckCircle className="w-4 h-4" /> : index + 1}
                      </div>
                      <div className="flex-1">
                        <h4
                          className={`font-medium ${milestone.completed ? "line-through text-muted-foreground" : ""}`}
                        >
                          {milestone.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">Due: {milestone.dueDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates on your project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">John Doe</span> uploaded new design files
                      </p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>SS</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">Sarah Smith</span> completed homepage wireframes
                      </p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>MJ</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">Mike Johnson</span> started development phase
                      </p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Project Communication</CardTitle>
              <CardDescription>Chat with your development team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
                {selectedProject.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.senderType === "client" ? "justify-end" : "justify-start"}`}
                  >
                    {message.senderType === "team" && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          {message.sender
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderType === "client"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                    </div>
                    {message.senderType === "client" && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>SJ</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1"
                />
                <Button variant="outline" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button onClick={sendMessage} size="sm">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-6">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Project Files</CardTitle>
              <CardDescription>Access and download project assets and deliverables</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedProject.files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{fileTypeIcons[file.type]}</div>
                      <div>
                        <h4 className="font-medium">{file.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {file.size} • Uploaded by {file.uploadedBy} on {file.uploadedAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Invoices & Payments</CardTitle>
              <CardDescription>View and manage your project invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedProject.invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <h4 className="font-medium">{invoice.number}</h4>
                      <p className="text-sm text-muted-foreground">{invoice.description}</p>
                      <p className="text-sm text-muted-foreground">Due: {invoice.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{invoice.amount}</p>
                      <Badge
                        variant={
                          invoice.status === "Paid"
                            ? "default"
                            : invoice.status === "Overdue"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
