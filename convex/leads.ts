import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Queries
export const getLeads = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("leads").order("desc").collect();
  },
});

export const getLead = query({
  args: { id: v.id("leads") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getLeadsByStatus = query({
  args: { 
    status: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("qualified"),
      v.literal("proposal"),
      v.literal("won"),
      v.literal("lost")
    )
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("leads")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

// Mutations
export const createLead = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    source: v.optional(v.string()),
    status: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("qualified"),
      v.literal("proposal"),
      v.literal("won"),
      v.literal("lost")
    ),
    notes: v.optional(v.string()),
    estimatedValue: v.optional(v.number()),
    currency: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("leads", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateLead = mutation({
  args: {
    id: v.id("leads"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    source: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("qualified"),
      v.literal("proposal"),
      v.literal("won"),
      v.literal("lost")
    )),
    notes: v.optional(v.string()),
    estimatedValue: v.optional(v.number()),
    currency: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const updateData = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined)
    );
    
    if (Object.keys(updateData).length === 0) {
      throw new Error("No valid fields to update");
    }

    return await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

export const deleteLead = mutation({
  args: { id: v.id("leads") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

export const convertLeadToClient = mutation({
  args: { id: v.id("leads") },
  handler: async (ctx, args) => {
    const lead = await ctx.db.get(args.id);
    if (!lead) {
      throw new Error("Lead not found");
    }

    // Create client from lead
    const now = Date.now();
    const clientId = await ctx.db.insert("clients", {
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      status: "active" as const,
      createdAt: now,
      updatedAt: now,
    });

    // Update lead status to won
    await ctx.db.patch(args.id, {
      status: "won" as const,
      updatedAt: now,
    });

    // Create analytics entry
    await ctx.db.insert("analytics", {
      type: "lead_converted" as const,
      value: lead.estimatedValue || 0,
      currency: lead.currency || "USD",
      leadId: args.id,
      clientId,
      date: now,
      metadata: { convertedFrom: "lead" },
    });

    return clientId;
  },
});