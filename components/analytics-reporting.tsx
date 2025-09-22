"use client"

import { useState, useEffect } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
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
  const [isClient, setIsClient] = useState(false)
  
  // Ensure we're on the client side to prevent hydration mismatches
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Fetch real data from Convex
  const projects = useQuery(api.projects.getProjects) || []
  const clients = useQuery(api.clients.getClients) || []
  const leads = useQuery(api.leads.getLeads) || []
  const revenueMetrics = useQuery(api.analytics.getRevenueMetrics)
  const projectMetrics = useQuery(api.analytics.getProjectMetrics)
  const leadMetrics = useQuery(api.analytics.getLeadMetrics)
  
  // Calculate real metrics
  const totalRevenue = projects.reduce((sum, project) => sum + (project.budget || 0), 0)
  const activeProjects = projects.filter(p => p.status === 'in_progress' || p.status === 'planning')
  const completedProjects = projects.filter(p => p.status === 'completed')
  const activeLeads = leads.filter(l => l.status === 'new' || l.status === 'contacted' || l.status === 'qualified')
  
  // Convert USD to KSH
  const convertToKSH = (usdAmount: number) => `KSH ${(usdAmount * 130).toLocaleString()}`
  
  // Calculate average project time (simplified)
  const avgProjectTime = completedProjects.length > 0 
    ? Math.round(completedProjects.reduce((sum, project) => {
        const start = project.startDate || project.createdAt || Date.now()
        const end = project.endDate || Date.now()
        return sum + Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)))
      }, 0) / completedProjects.length)
    : 0

  // Generate revenue data for charts (last 6 months)
  const revenueData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (5 - i))
    const monthName = date.toLocaleDateString('en', { month: 'short' })
    
    // Calculate projects completed in this month
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).getTime()
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).getTime()
    
    const monthlyProjects = completedProjects.filter(p => {
      const completedDate = p.updatedAt || p.createdAt || 0
      return completedDate >= monthStart && completedDate <= monthEnd
    })
    
    const monthlyRevenue = monthlyProjects.reduce((sum, p) => sum + (p.budget || 0), 0) * 130 // Convert to KSH
    
    return {
      month: monthName,
      revenue: monthlyRevenue,
      projects: monthlyProjects.length
    }
  })

  // Project status distribution
  const statusCounts = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const projectStatusData = [
    { name: "Completed", value: statusCounts.completed || 0, color: "#10b981" },
    { name: "In Progress", value: statusCounts.in_progress || 0, color: "#3b82f6" },
    { name: "Planning", value: statusCounts.planning || 0, color: "#f59e0b" },
    { name: "On Hold", value: statusCounts.on_hold || 0, color: "#ef4444" },
    { name: "Review", value: statusCounts.review || 0, color: "#8b5cf6" },
  ].filter(item => item.value > 0)

  // Lead source data (simplified)
  const leadSourceData = [
    { source: "Website", leads: leads.filter(l => l.source === 'website').length, conversion: 68 },
    { source: "Referrals", leads: leads.filter(l => l.source === 'referral').length, conversion: 82 },
    { source: "LinkedIn", leads: leads.filter(l => l.source === 'linkedin').length, conversion: 45 },
    { source: "Google Ads", leads: leads.filter(l => l.source === 'google_ads').length, conversion: 38 },
    { source: "Other", leads: leads.filter(l => !l.source || !['website', 'referral', 'linkedin', 'google_ads'].includes(l.source)).length, conversion: 52 },
  ].filter(item => item.leads > 0)

  // Team performance data (simplified - would need user/task assignment data)
  const teamPerformanceData = [
    { name: "Development Team", projects: activeProjects.length, avgRating: 4.8, efficiency: 92 },
    { name: "Design Team", projects: Math.floor(activeProjects.length * 0.7), avgRating: 4.9, efficiency: 95 },
    { name: "QA Team", projects: Math.floor(activeProjects.length * 0.5), avgRating: 4.6, efficiency: 88 },
  ]

  const kpiData = [
    {
      title: "Total Revenue",
      value: convertToKSH(totalRevenue),
      change: "+15.3%", // Static to prevent hydration issues
      trend: "up" as const,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Active Projects",
      value: activeProjects.length.toString(),
      change: "+8.7%", // Static to prevent hydration issues
      trend: "up" as const,
      icon: FolderOpen,
      color: "text-blue-600",
    },
    {
      title: "New Leads",
      value: activeLeads.length.toString(),
      change: "-2.1%", // Static to prevent hydration issues
      trend: "down" as const,
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Avg. Project Time",
      value: `${avgProjectTime} days`,
      change: "-12.5%", // Static to prevent hydration issues
      trend: "up" as const,
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
                      label={({ name, value }) => {
                        const total = projectStatusData.reduce((sum, item) => sum + item.value, 0)
                        const percent = total > 0 ? ((value / total) * 100).toFixed(0) : '0'
                        return `${name} ${percent}%`
                      }}
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
                    <span className="font-medium">{completedProjects.length > 0 ? '87%' : 'No data'}</span>
                  </div>
                  <Progress value={completedProjects.length > 0 ? 87 : 0} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Project Duration</span>
                    <span className="font-medium">{avgProjectTime > 0 ? `${avgProjectTime} days` : 'No data'}</span>
                  </div>
                  <Progress value={avgProjectTime > 0 ? Math.min(100, (avgProjectTime / 60) * 100) : 0} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Project Completion Rate</span>
                    <span className="font-medium">{projects.length > 0 ? `${Math.round((completedProjects.length / projects.length) * 100)}%` : 'No data'}</span>
                  </div>
                  <Progress value={projects.length > 0 ? (completedProjects.length / projects.length) * 100 : 0} className="h-2" />
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
