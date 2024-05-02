import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    image: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.email) return null;
    const tasks = await ctx.db.insert('users', {
      name: args.name,
      email: args.email,
      image: args.image,
    });
    return tasks;
  },
});

export const getUser = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.email) return null;
    const tasks = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('email'), args.email))
      .order('desc')
      .collect();
    return tasks[0];
  },
});
