import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(), // Clerk user ID
    first_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
    email: v.string(),
    image_url: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user_id", ["userId"]),

  clients: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("pending")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_email", ["email"]),

  projects: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    clientId: v.id("clients"),
    status: v.union(
      v.literal("planning"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("completed"),
      v.literal("on_hold")
    ),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    budget: v.optional(v.number()),
    currency: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_client", ["clientId"])
    .index("by_status", ["status"]),

  leads: defineTable({
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
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_status", ["status"]),

  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    projectId: v.optional(v.id("projects")),
    assignedTo: v.optional(v.string()),
    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("completed")
    ),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    dueDate: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_project", ["projectId"])
    .index("by_status", ["status"]),

  analytics: defineTable({
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
    date: v.number(),
    metadata: v.optional(v.any()),
  })
    .index("by_type", ["type"])
    .index("by_date", ["date"]),
});