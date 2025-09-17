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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
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

// Lead form validation schema
const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  status: z.enum(["new", "contacted", "qualified", "proposal", "won", "lost"]),
  source: z.string().optional(),
  notes: z.string().optional(),
  estimatedValue: z.number().optional(),
})

type LeadFormData = z.infer<typeof leadSchema>

export function CRMLeads() {
  // Fetch leads from Convex database
  const leads = useQuery(api.leads.getLeads) || []
  
  // Mutations for database operations
  const createLead = useMutation(api.leads.createLead)
  const updateLead = useMutation(api.leads.updateLead)
  const deleteLead = useMutation(api.leads.deleteLead)
  const convertToClient = useMutation(api.leads.convertLeadToClient)
  
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Form handling
  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      status: "new",
      source: "",
      notes: "",
      estimatedValue: 0,
    },
  })

  const statusColors = {
    new: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    contacted: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    qualified: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    proposal: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    won: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
    lost: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  // Currency conversion from USD to KSH (1 USD = 130 KSH)
  const convertToKSH = (usdAmount: number) => {
    return `KSH ${(usdAmount * 130).toLocaleString()}`
  }

  // Handle form submission
  const onSubmit = async (data: LeadFormData) => {
    try {
      setIsLoading(true)
      await createLead({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        status: data.status,
        source: data.source,
        notes: data.notes,
        estimatedValue: data.estimatedValue,
        currency: "USD",
      })
      
      toast({
        title: "Success!",
        description: "Lead has been added to the database.",
      })
      
      form.reset()
      setIsAddLeadOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add lead. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle lead deletion
  const handleDeleteLead = async (leadId: string) => {
    try {
      await deleteLead({ id: leadId as any })
      toast({
        title: "Success!",
        description: "Lead has been deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete lead.",
        variant: "destructive",
      })
    }
  }

  // Handle lead to client conversion
  const handleConvertToClient = async (leadId: string) => {
    try {
      await convertToClient({ id: leadId as any })
      toast({
        title: "Success!",
        description: "Lead has been converted to a client!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert lead to client.",
        variant: "destructive",
      })
    }
  }

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const leadStats = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    qualified: leads.filter((l) => l.status === "qualified").length,
    proposals: leads.filter((l) => l.status === "proposal").length,
    won: leads.filter((l) => l.status === "won").length,
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    {...form.register("name")}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@company.com" 
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    placeholder="+1 (555) 123-4567" 
                    {...form.register("phone")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input 
                    id="company" 
                    placeholder="Company Inc." 
                    {...form.register("company")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedValue">Estimated Value (USD)</Label>
                  <Input 
                    id="estimatedValue" 
                    type="number" 
                    placeholder="50000" 
                    {...form.register("estimatedValue", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">Lead Source</Label>
                  <Select onValueChange={(value) => form.setValue("source", value)}>
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
                  <Textarea 
                    id="notes" 
                    placeholder="Project requirements, timeline, special notes..." 
                    {...form.register("notes")}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsAddLeadOpen(false)
                    form.reset()
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Lead"}
                </Button>
              </div>
            </form>
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
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="won">Won</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
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
                <TableRow key={lead._id} className="animate-slide-in">
                  <TableCell>
                    <div>
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {lead.email}
                      </div>
                      {lead.phone && (
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {lead.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{lead.company || "N/A"}</TableCell>
                  <TableCell>
                    {lead.estimatedValue ? convertToKSH(lead.estimatedValue) : "Not specified"}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[lead.status as keyof typeof statusColors]}>
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{lead.source || "Unknown"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {lead.status === "won" && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleConvertToClient(lead._id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          Convert to Client
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteLead(lead._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredLeads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-muted-foreground">
                      {leads.length === 0 ? "No leads found. Add your first lead to get started!" : "No leads match your search criteria."}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
