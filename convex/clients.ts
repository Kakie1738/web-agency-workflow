import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Queries
export const getClients = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("clients").order("desc").collect();
  },
});

export const getClient = query({
  args: { id: v.id("clients") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getClientsByStatus = query({
  args: { status: v.union(v.literal("active"), v.literal("inactive"), v.literal("pending")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("clients")
      .filter((q) => q.eq(q.field("status"), args.status))
      .collect();
  },
});

// Mutations
export const createClient = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("pending")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("clients", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateClient = mutation({
  args: {
    id: v.id("clients"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"), v.literal("pending"))),
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

export const deleteClient = mutation({
  args: { id: v.id("clients") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});