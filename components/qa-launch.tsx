"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  CheckSquare,
  TestTube,
  Rocket,
  Monitor,
  Smartphone,
  Globe,
  Shield,
  Zap,
  CheckCircle,
  ExternalLink,
  Bug,
} from "lucide-react"

interface QAItem {
  id: string
  category: string
  item: string
  completed: boolean
  priority: "Low" | "Medium" | "High" | "Critical"
  notes?: string
}

interface LaunchStep {
  id: string
  step: string
  description: string
  completed: boolean
  url?: string
  notes?: string
}

interface Project {
  id: string
  name: string
  client: string
  status: "QA Testing" | "Pre-Launch" | "Launched" | "Post-Launch"
  qaItems: QAItem[]
  launchSteps: LaunchStep[]
  testingEnvironments: {
    staging: string
    production?: string
  }
}

export function QALaunch() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "TechCorp Website Redesign",
      client: "TechCorp Inc.",
      status: "QA Testing",
      testingEnvironments: {
        staging: "https://staging.techcorp.com",
        production: "https://techcorp.com",
      },
      qaItems: [
        {
          id: "qa1",
          category: "Cross-Browser Testing",
          item: "Test on Chrome (latest)",
          completed: true,
          priority: "High",
        },
        {
          id: "qa2",
          category: "Cross-Browser Testing",
          item: "Test on Firefox (latest)",
          completed: true,
          priority: "High",
        },
        {
          id: "qa3",
          category: "Cross-Browser Testing",
          item: "Test on Safari (latest)",
          completed: false,
          priority: "High",
        },
        {
          id: "qa4",
          category: "Mobile Responsiveness",
          item: "Test on iPhone (iOS Safari)",
          completed: false,
          priority: "Critical",
        },
        {
          id: "qa5",
          category: "Mobile Responsiveness",
          item: "Test on Android (Chrome)",
          completed: false,
          priority: "Critical",
        },
        {
          id: "qa6",
          category: "Performance",
          item: "Page load speed < 3 seconds",
          completed: true,
          priority: "High",
        },
        {
          id: "qa7",
          category: "SEO",
          item: "Meta tags optimization",
          completed: true,
          priority: "Medium",
        },
        {
          id: "qa8",
          category: "Security",
          item: "SSL certificate installed",
          completed: false,
          priority: "Critical",
        },
      ],
      launchSteps: [
        {
          id: "l1",
          step: "Domain & DNS Setup",
          description: "Configure domain and DNS settings",
          completed: true,
          url: "https://techcorp.com",
        },
        {
          id: "l2",
          step: "SSL Certificate",
          description: "Install and configure SSL certificate",
          completed: false,
        },
        {
          id: "l3",
          step: "Production Deployment",
          description: "Deploy to production server",
          completed: false,
        },
        {
          id: "l4",
          step: "Analytics Setup",
          description: "Configure Google Analytics and tracking",
          completed: false,
        },
        {
          id: "l5",
          step: "Search Console",
          description: "Submit sitemap to Google Search Console",
          completed: false,
        },
      ],
    },
  ])

  const [selectedProject, setSelectedProject] = useState<Project>(projects[0])
  const [isAddIssueOpen, setIsAddIssueOpen] = useState(false)

  const qaCategories = [
    { name: "Cross-Browser Testing", icon: Globe, color: "text-blue-600" },
    { name: "Mobile Responsiveness", icon: Smartphone, color: "text-green-600" },
    { name: "Performance", icon: Zap, color: "text-yellow-600" },
    { name: "SEO", icon: Globe, color: "text-purple-600" },
    { name: "Security", icon: Shield, color: "text-red-600" },
    { name: "Accessibility", icon: Monitor, color: "text-indigo-600" },
  ]

  const getQAProgress = () => {
    const completed = selectedProject.qaItems.filter((item) => item.completed).length
    return Math.round((completed / selectedProject.qaItems.length) * 100)
  }

  const getLaunchProgress = () => {
    const completed = selectedProject.launchSteps.filter((step) => step.completed).length
    return Math.round((completed / selectedProject.launchSteps.length) * 100)
  }

  const getItemsByCategory = (category: string) => {
    return selectedProject.qaItems.filter((item) => item.category === category)
  }

  const toggleQAItem = (itemId: string) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === selectedProject.id
          ? {
              ...project,
              qaItems: project.qaItems.map((item) =>
                item.id === itemId ? { ...item, completed: !item.completed } : item,
              ),
            }
          : project,
      ),
    )
    setSelectedProject((prev) => ({
      ...prev,
      qaItems: prev.qaItems.map((item) => (item.id === itemId ? { ...item, completed: !item.completed } : item)),
    }))
  }

  const toggleLaunchStep = (stepId: string) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === selectedProject.id
          ? {
              ...project,
              launchSteps: project.launchSteps.map((step) =>
                step.id === stepId ? { ...step, completed: !step.completed } : step,
              ),
            }
          : project,
      ),
    )
    setSelectedProject((prev) => ({
      ...prev,
      launchSteps: prev.launchSteps.map((step) =>
        step.id === stepId ? { ...step, completed: !step.completed } : step,
      ),
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">QA & Launch Tracking</h1>
          <p className="text-muted-foreground mt-1">Ensure quality and manage deployment processes</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddIssueOpen} onOpenChange={setIsAddIssueOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Bug className="w-4 h-4 mr-2" />
                Report Issue
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report QA Issue</DialogTitle>
                <DialogDescription>Document a bug or issue found during testing</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="issue-title">Issue Title</Label>
                  <Input id="issue-title" placeholder="Brief description of the issue" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issue-description">Description</Label>
                  <Textarea id="issue-description" placeholder="Detailed description of the issue..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="browser">Browser/Device</Label>
                    <Input id="browser" placeholder="Chrome, Safari, iPhone, etc." />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddIssueOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddIssueOpen(false)}>Report Issue</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button className="bg-primary hover:bg-primary/90 animate-pulse-glow">
            <Rocket className="w-4 h-4 mr-2" />
            Launch Project
          </Button>
        </div>
      </div>

      {/* Project Overview */}
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="w-5 h-5 text-primary" />
                {selectedProject.name}
              </CardTitle>
              <CardDescription>{selectedProject.client}</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Badge
                variant={
                  selectedProject.status === "Launched"
                    ? "default"
                    : selectedProject.status === "QA Testing"
                      ? "secondary"
                      : "outline"
                }
              >
                {selectedProject.status}
              </Badge>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={selectedProject.testingEnvironments.staging} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Staging
                  </a>
                </Button>
                {selectedProject.testingEnvironments.production && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={selectedProject.testingEnvironments.production} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Production
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-green-600" />
              QA Testing Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Overall Progress</span>
                <span className="text-sm font-medium">{getQAProgress()}%</span>
              </div>
              <Progress value={getQAProgress()} className="h-2" />
              <div className="text-sm text-muted-foreground">
                {selectedProject.qaItems.filter((item) => item.completed).length} of {selectedProject.qaItems.length}{" "}
                items completed
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-blue-600" />
              Launch Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Launch Readiness</span>
                <span className="text-sm font-medium">{getLaunchProgress()}%</span>
              </div>
              <Progress value={getLaunchProgress()} className="h-2" />
              <div className="text-sm text-muted-foreground">
                {selectedProject.launchSteps.filter((step) => step.completed).length} of{" "}
                {selectedProject.launchSteps.length} steps completed
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="qa-checklist" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="qa-checklist">QA Checklist</TabsTrigger>
          <TabsTrigger value="launch-steps">Launch Steps</TabsTrigger>
        </TabsList>

        <TabsContent value="qa-checklist" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {qaCategories.map((category) => (
              <Card key={category.name} className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <category.icon className={`w-5 h-5 ${category.color}`} />
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getItemsByCategory(category.name).map((item) => (
                      <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <Checkbox
                          checked={item.completed}
                          onCheckedChange={() => toggleQAItem(item.id)}
                          className="mt-0.5"
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${item.completed ? "line-through text-muted-foreground" : ""}`}>
                              {item.item}
                            </span>
                            <Badge
                              variant={
                                item.priority === "Critical"
                                  ? "destructive"
                                  : item.priority === "High"
                                    ? "default"
                                    : "secondary"
                              }
                              className="text-xs"
                            >
                              {item.priority}
                            </Badge>
                          </div>
                          {item.notes && <p className="text-xs text-muted-foreground">{item.notes}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="launch-steps" className="space-y-6">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Launch Checklist</CardTitle>
              <CardDescription>Complete these steps to successfully launch your project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedProject.launchSteps.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          step.completed
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {step.completed ? <CheckCircle className="w-4 h-4" /> : index + 1}
                      </div>
                      <Checkbox checked={step.completed} onCheckedChange={() => toggleLaunchStep(step.id)} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-medium ${step.completed ? "line-through text-muted-foreground" : ""}`}>
                          {step.step}
                        </h4>
                        {step.url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={step.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                      {step.notes && (
                        <p className="text-xs text-muted-foreground bg-background p-2 rounded">{step.notes}</p>
                      )}
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
