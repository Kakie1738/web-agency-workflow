import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

export const store = internalMutation({
  args: {
    userId: v.string(),
    first_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
    email: v.string(),
    image_url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .unique();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        first_name: args.first_name,
        last_name: args.last_name,
        email: args.email,
        image_url: args.image_url,
        updatedAt: Date.now(),
      });
      return existingUser._id;
    } else {
      // Create new user
      const userId = await ctx.db.insert("users", {
        userId: args.userId,
        first_name: args.first_name,
        last_name: args.last_name,
        email: args.email,
        image_url: args.image_url,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      return userId;
    }
  },
});

export const remove = internalMutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .unique();

    if (user) {
      await ctx.db.delete(user._id);
    }
  },
});

export const get = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .unique();
  },
});

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});