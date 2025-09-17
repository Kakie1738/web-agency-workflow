"use client"

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
  const stats = [
    {
      title: "Active Projects",
      value: "12",
      change: "+2 this week",
      icon: FolderOpen,
      color: "text-chart-1",
    },
    {
      title: "Total Revenue",
      value: "KSH 16,185,000",
      change: "+15% from last month",
      icon: DollarSign,
      color: "text-chart-2",
    },
    {
      title: "Active Leads",
      value: "28",
      change: "+8 new leads",
      icon: Users,
      color: "text-chart-3",
    },
    {
      title: "Completed Projects",
      value: "156",
      change: "+12 this month",
      icon: CheckCircle,
      color: "text-chart-4",
    },
  ]

  const recentProjects = [
    {
      name: "TechCorp Website Redesign",
      client: "TechCorp Inc.",
      status: "In Development",
      progress: 75,
      dueDate: "2024-01-15",
      priority: "High",
    },
    {
      name: "E-commerce Platform",
      client: "ShopMart",
      status: "QA Testing",
      progress: 90,
      dueDate: "2024-01-10",
      priority: "Critical",
    },
    {
      name: "Portfolio Website",
      client: "Creative Studio",
      status: "Design Phase",
      progress: 45,
      dueDate: "2024-01-20",
      priority: "Medium",
    },
  ]

  const upcomingTasks = [
    { task: "Client presentation for TechCorp", time: "2:00 PM", priority: "High" },
    { task: "QA review for ShopMart platform", time: "4:30 PM", priority: "Critical" },
    { task: "Design mockup delivery", time: "Tomorrow 10:00 AM", priority: "Medium" },
    { task: "Weekly team standup", time: "Tomorrow 2:00 PM", priority: "Low" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agency Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your projects today.</p>
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
            {recentProjects.map((project, index) => (
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
            ))}
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
            {upcomingTasks.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
              >
                <div className="flex items-center gap-3">
                  {item.priority === "Critical" ? (
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                  ) : item.priority === "High" ? (
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
                    item.priority === "Critical" ? "destructive" : item.priority === "High" ? "default" : "secondary"
                  }
                  className="text-xs"
                >
                  {item.priority}
                </Badge>
              </div>
            ))}
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
