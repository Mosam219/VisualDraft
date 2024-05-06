import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Id } from './_generated/dataModel';
import { getUser } from './users';

export interface CanvasElementsType {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  mode: string;
  text?: string;
}

export const createProject = mutation({
  handler: async (
    ctx,
    args: {
      elements: Array<CanvasElementsType>;
      createdBy: string;
      docContent: string;
      name: string;
      teamId: Id<'teams'>;
    },
  ) => {
    const taskId = await ctx.db.insert('project', {
      elements: args.elements,
      createdBy: args.createdBy,
      docContent: args.docContent,
      name: args.name,
      teamsId: args.teamId,
    });
    return taskId;
  },
});

export const getDoc = query({
  args: {
    id: v.optional(v.id('project')),
  },
  handler: async (ctx, args) => {
    if (!args.id) return null;
    return await ctx.db.get(args.id);
  },
});

export const updateCanvas = mutation({
  handler: async (ctx, args: { elements: Array<CanvasElementsType>; docId: Id<'project'> }) => {
    const taskId = await ctx.db.patch(args.docId, { elements: args.elements });
    return taskId;
  },
});

export const updateDoc = mutation({
  handler: async (ctx, args: { content: string; docId: Id<'project'> }) => {
    const taskId = await ctx.db.patch(args.docId, { docContent: args.content });
    return taskId;
  },
});

export const getAllUserProject = query({
  args: {
    createdBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.createdBy) return null;
    const tasks = await ctx.db
      .query('project')
      .filter((q) => q.eq(q.field('createdBy'), args.createdBy))
      .order('desc')
      .collect();
    return tasks;
  },
});

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

export const getProjectsByTeamId = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.id) return null;
    const tasks = await ctx.db
      .query('project')
      .filter((q) => q.eq(q.field('teamsId'), args.id))
      .order('desc')
      .collect();
    return Promise.all(
      (tasks ?? []).map(async (task) => ({
        ...task,
        authorName: await getUser(ctx, { email: task.createdBy }).then((user) => user?.name),
      })),
    );
  },
});
