import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Queries
export const getAnalytics = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("analytics").order("desc").collect();
  },
});

export const getAnalyticsByType = query({
  args: { 
    type: v.union(
      v.literal("project_completed"),
      v.literal("client_acquired"),
      v.literal("lead_converted"),
      v.literal("revenue_generated")
    )
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("analytics")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .collect();
  },
});

export const getAnalyticsByDateRange = query({
  args: { 
    startDate: v.number(),
    endDate: v.number()
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("analytics")
      .withIndex("by_date", (q) => q.gte("date", args.startDate).lte("date", args.endDate))
      .collect();
  },
});

export const getRevenueMetrics = query({
  args: {},
  handler: async (ctx) => {
    const revenueData = await ctx.db
      .query("analytics")
      .withIndex("by_type", (q) => q.eq("type", "revenue_generated"))
      .collect();

    const totalRevenue = revenueData.reduce((sum, entry) => sum + entry.value, 0);
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0, 0, 0, 0);

    const monthlyRevenue = revenueData
      .filter(entry => entry.date >= currentMonthStart.getTime())
      .reduce((sum, entry) => sum + entry.value, 0);

    return {
      totalRevenue,
      monthlyRevenue,
      entries: revenueData.length,
    };
  },
});

export const getProjectMetrics = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();
    const completedProjects = projects.filter(p => p.status === "completed");
    
    const statusCounts = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: projects.length,
      completed: completedProjects.length,
      statusDistribution: statusCounts,
    };
  },
});

export const getLeadMetrics = query({
  args: {},
  handler: async (ctx) => {
    const leads = await ctx.db.query("leads").collect();
    const wonLeads = leads.filter(l => l.status === "won");
    
    const statusCounts = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const conversionRate = leads.length > 0 ? (wonLeads.length / leads.length) * 100 : 0;

    return {
      total: leads.length,
      converted: wonLeads.length,
      conversionRate,
      statusDistribution: statusCounts,
    };
  },
});

// Mutations
export const recordAnalytics = mutation({
  args: {
    type: v.union(
      v.literal("project_completed"),
      v.literal("client_acquired"),
      v.literal("lead_converted"),
      v.literal("revenue_generated")
    ),
    value: v.number(),
    currency: v.optional(v.string()),
    projectId: v.optional(v.id("projects")),
    clientId: v.optional(v.id("clients")),
    leadId: v.optional(v.id("leads")),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("analytics", {
      ...args,
      date: Date.now(),
    });
  },
});

export const recordRevenue = mutation({
  args: {
    amount: v.number(),
    currency: v.string(),
    projectId: v.optional(v.id("projects")),
    clientId: v.optional(v.id("clients")),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("analytics", {
      type: "revenue_generated" as const,
      value: args.amount,
      currency: args.currency,
      projectId: args.projectId,
      clientId: args.clientId,
      date: Date.now(),
      metadata: { description: args.description },
    });
  },
});