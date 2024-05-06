import { v } from 'convex/values';
import { Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';

export const createTeam = mutation({
  handler: async (ctx, args: { name: string; projects: Id<'project'>[]; createdBy: string }) => {
    const taskId = await ctx.db.insert('teams', {
      name: args.name,
      createdBy: args.createdBy,
      projects: args.projects,
    });
    return taskId;
  },
});

export const updateTeam = mutation({
  handler: async (ctx, args: { id: Id<'teams'>; name: string; projects: Id<'project'>[] }) => {
    const taskId = await ctx.db.patch(args.id, {
      name: args.name,
      projects: args.projects,
    });
    return taskId;
  },
});

export const getUserTeams = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const teams = await ctx.db
      .query('teams')
      .filter((q) => q.eq(q.field('createdBy'), args.email))
      .collect();
    return teams;
  },
});

export const getTeamById = query({
  handler: async (ctx, args: { id: Id<'teams'> }) => {
    const teams = await ctx.db.get(args.id);
    return teams;
  },
});
