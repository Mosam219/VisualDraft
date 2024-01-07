import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Id } from './_generated/dataModel';

export interface CanvasElementsType {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  mode: string;
  text?: string;
}

export const createCanvas = mutation({
  handler: async (
    ctx,
    args: { elements: Array<CanvasElementsType>; userId: string; docContent: string; name: string },
  ) => {
    const taskId = await ctx.db.insert('canvas', {
      elements: args.elements,
      userId: args.userId,
      docContent: args.docContent,
      name: args.name,
    });
    return taskId;
  },
});

export const getDoc = query({
  args: {
    id: v.optional(v.id('canvas')),
  },
  handler: async (ctx, args) => {
    if (!args.id) return null;
    return await ctx.db.get(args.id);
  },
});

export const updateCanvas = mutation({
  handler: async (ctx, args: { elements: Array<CanvasElementsType>; docId: Id<'canvas'> }) => {
    const taskId = await ctx.db.patch(args.docId, { elements: args.elements });
    return taskId;
  },
});

export const updateDoc = mutation({
  handler: async (ctx, args: { content: string; docId: Id<'canvas'> }) => {
    const taskId = await ctx.db.patch(args.docId, { docContent: args.content });
    return taskId;
  },
});

export const getAllUserCanvas = query({
  args: {
    id: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.id) return null;
    const tasks = await ctx.db
      .query('canvas')
      .filter((q) => q.eq(q.field('userId'), args.id))
      .order('desc')
      .collect();
    return tasks;
  },
});
