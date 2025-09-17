"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  budget: string
  status: "New" | "Qualified" | "Proposal Sent" | "Won" | "Lost"
  source: string
  createdAt: string
  notes: string
}

export function CRMLeads() {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@techcorp.com",
      phone: "+1 (555) 123-4567",
      company: "TechCorp Inc.",
      budget: "KSH 6,500,000 - KSH 9,750,000",
      status: "Qualified",
      source: "Website Form",
      createdAt: "2024-01-08",
      notes: "Interested in complete website redesign with e-commerce functionality",
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "m.chen@shopmart.com",
      phone: "+1 (555) 987-6543",
      company: "ShopMart",
      budget: "KSH 3,250,000 - KSH 6,500,000",
      status: "Proposal Sent",
      source: "Referral",
      createdAt: "2024-01-05",
      notes: "Looking for modern e-commerce platform with inventory management",
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      email: "emily@creativestudio.com",
      phone: "+1 (555) 456-7890",
      company: "Creative Studio",
      budget: "KSH 1,300,000 - KSH 3,250,000",
      status: "New",
      source: "LinkedIn",
      createdAt: "2024-01-10",
      notes: "Portfolio website for design agency",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false)

  const statusColors = {
    New: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    Qualified: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "Proposal Sent": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Won: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
    Lost: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const leadStats = {
    total: leads.length,
    new: leads.filter((l) => l.status === "New").length,
    qualified: leads.filter((l) => l.status === "Qualified").length,
    proposals: leads.filter((l) => l.status === "Proposal Sent").length,
    won: leads.filter((l) => l.status === "Won").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">CRM & Lead Management</h1>
          <p className="text-muted-foreground mt-1">Track and manage your potential clients and opportunities</p>
        </div>
        <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 animate-pulse-glow">
              <Plus className="w-4 h-4 mr-2" />
              Add New Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Lead</DialogTitle>
              <DialogDescription>Enter the details of your new potential client</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@company.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+1 (555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" placeholder="Company Inc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget Range</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-10k">Under KSH 1,300,000</SelectItem>
                    <SelectItem value="10k-25k">KSH 1,300,000 - KSH 3,250,000</SelectItem>
                    <SelectItem value="25k-50k">KSH 3,250,000 - KSH 6,500,000</SelectItem>
                    <SelectItem value="50k-75k">KSH 6,500,000 - KSH 9,750,000</SelectItem>
                    <SelectItem value="75k-100k">KSH 9,750,000 - KSH 13,000,000</SelectItem>
                    <SelectItem value="over-100k">Over KSH 13,000,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Lead Source</Label>
                <Select>
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
                <Textarea id="notes" placeholder="Project requirements, timeline, special notes..." />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddLeadOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddLeadOpen(false)}>Add Lead</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="glass-effect">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">{leadStats.total}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-effect">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New Leads</p>
                <p className="text-2xl font-bold text-blue-600">{leadStats.new}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-effect">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Qualified</p>
                <p className="text-2xl font-bold text-green-600">{leadStats.qualified}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-effect">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Proposals</p>
                <p className="text-2xl font-bold text-yellow-600">{leadStats.proposals}</p>
              </div>
              <Mail className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-effect">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Won</p>
                <p className="text-2xl font-bold text-emerald-600">{leadStats.won}</p>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-effect">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search leads by name, company, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Proposal Sent">Proposal Sent</SelectItem>
                <SelectItem value="Won">Won</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Leads Overview</CardTitle>
          <CardDescription>Manage your potential clients and track their progress</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id} className="animate-slide-in">
                  <TableCell>
                    <div>
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {lead.email}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {lead.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{lead.company}</TableCell>
                  <TableCell>{lead.budget}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[lead.status]}>{lead.status}</Badge>
                  </TableCell>
                  <TableCell>{lead.source}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {lead.createdAt}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
