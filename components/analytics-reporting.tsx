"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  FolderOpen,
  Clock,
  Target,
  Download,
  Filter,
} from "lucide-react"

export function AnalyticsReporting() {
  const [timeRange, setTimeRange] = useState("last-30-days")

  // Sample data for charts
  const revenueData = [
    { month: "Jan", revenue: 5850000, projects: 8 },
    { month: "Feb", revenue: 6760000, projects: 10 },
    { month: "Mar", revenue: 6240000, projects: 9 },
    { month: "Apr", revenue: 7930000, projects: 12 },
    { month: "May", revenue: 7150000, projects: 11 },
    { month: "Jun", revenue: 8710000, projects: 14 },
  ]

  const projectStatusData = [
    { name: "Completed", value: 45, color: "#10b981" },
    { name: "In Progress", value: 25, color: "#3b82f6" },
    { name: "Planning", value: 15, color: "#f59e0b" },
    { name: "On Hold", value: 15, color: "#ef4444" },
  ]

  const leadSourceData = [
    { source: "Website", leads: 35, conversion: 68 },
    { source: "Referrals", leads: 28, conversion: 82 },
    { source: "LinkedIn", leads: 22, conversion: 45 },
    { source: "Google Ads", leads: 18, conversion: 38 },
    { source: "Social Media", leads: 15, conversion: 52 },
  ]

  const teamPerformanceData = [
    { name: "John Doe", projects: 12, avgRating: 4.8, efficiency: 92 },
    { name: "Sarah Smith", projects: 10, avgRating: 4.9, efficiency: 95 },
    { name: "Mike Johnson", projects: 8, avgRating: 4.6, efficiency: 88 },
    { name: "Emily Chen", projects: 9, avgRating: 4.7, efficiency: 90 },
  ]

  const kpiData = [
    {
      title: "Total Revenue",
      value: "KSH 42,640,000",
      change: "+15.3%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Active Projects",
      value: "25",
      change: "+8.7%",
      trend: "up",
      icon: FolderOpen,
      color: "text-blue-600",
    },
    {
      title: "New Leads",
      value: "118",
      change: "-2.1%",
      trend: "down",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Avg. Project Time",
      value: "28 days",
      change: "-12.5%",
      trend: "up",
      icon: Clock,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics & Reporting</h1>
          <p className="text-muted-foreground mt-1">Track performance and gain insights into your agency operations</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 days</SelectItem>
              <SelectItem value="last-30-days">Last 30 days</SelectItem>
              <SelectItem value="last-90-days">Last 90 days</SelectItem>
              <SelectItem value="last-year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-primary hover:bg-primary/90 animate-pulse-glow">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={kpi.title} className="glass-effect animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                  <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {kpi.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${kpi.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {kpi.change}
                    </span>
                  </div>
                </div>
                <kpi.icon className={`w-8 h-8 ${kpi.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="leads">Leads & Sales</TabsTrigger>
          <TabsTrigger value="team">Team Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Revenue Trends
                </CardTitle>
                <CardDescription>Monthly revenue and project completion</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [`KSH ${value.toLocaleString()}`, name]} />
                    <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Project Status Distribution */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Project Status Distribution
                </CardTitle>
                <CardDescription>Current project portfolio breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Performance Summary */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Monthly Performance Summary</CardTitle>
              <CardDescription>Key metrics comparison across recent months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="revenue" fill="#8b5cf6" name="Revenue (KSH)" />
                  <Bar yAxisId="right" dataKey="projects" fill="#10b981" name="Projects Completed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Timeline Performance */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Project Timeline Performance</CardTitle>
                <CardDescription>On-time delivery rates and average project duration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>On-time Delivery Rate</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Project Duration</span>
                    <span className="font-medium">28 days</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Client Satisfaction Score</span>
                    <span className="font-medium">4.8/5.0</span>
                  </div>
                  <Progress value={96} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Project Types Breakdown */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Project Types</CardTitle>
                <CardDescription>Distribution of project categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">Website Redesign</p>
                      <p className="text-sm text-muted-foreground">45% of projects</p>
                    </div>
                    <Badge variant="secondary">18 projects</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">E-commerce Development</p>
                      <p className="text-sm text-muted-foreground">30% of projects</p>
                    </div>
                    <Badge variant="secondary">12 projects</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">Landing Pages</p>
                      <p className="text-sm text-muted-foreground">15% of projects</p>
                    </div>
                    <Badge variant="secondary">6 projects</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">Web Applications</p>
                      <p className="text-sm text-muted-foreground">10% of projects</p>
                    </div>
                    <Badge variant="secondary">4 projects</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lead Sources Performance */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Lead Sources & Conversion</CardTitle>
                <CardDescription>Performance of different lead generation channels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={leadSourceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="source" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="leads" fill="#3b82f6" name="Leads Generated" />
                    <Bar dataKey="conversion" fill="#10b981" name="Conversion Rate %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Sales Funnel */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Sales Funnel</CardTitle>
                <CardDescription>Lead progression through sales stages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Leads</span>
                    <span className="font-medium">118</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Qualified Leads</span>
                    <span className="font-medium">72 (61%)</span>
                  </div>
                  <Progress value={61} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Proposals Sent</span>
                    <span className="font-medium">45 (38%)</span>
                  </div>
                  <Progress value={38} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Closed Won</span>
                    <span className="font-medium">28 (24%)</span>
                  </div>
                  <Progress value={24} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Team Performance Metrics</CardTitle>
              <CardDescription>Individual team member performance and productivity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamPerformanceData.map((member, index) => (
                  <div key={member.name} className="p-4 rounded-lg bg-muted/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{member.name}</h4>
                      <Badge variant="outline">{member.projects} projects</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Client Rating</span>
                          <span className="font-medium">{member.avgRating}/5.0</span>
                        </div>
                        <Progress value={(member.avgRating / 5) * 100} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Efficiency Score</span>
                          <span className="font-medium">{member.efficiency}%</span>
                        </div>
                        <Progress value={member.efficiency} className="h-2" />
                      </div>
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
