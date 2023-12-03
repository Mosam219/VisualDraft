import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export interface CanvasElementsType {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  mode: string;
}

export const saveCanvas = mutation({
  handler: async (ctx, args: { elements: Array<CanvasElementsType>; userId: string }) => {
    const taskId = await ctx.db.insert('canvas', { elements: args.elements, userId: args.userId });
    return taskId;
  },
});

export const getCanvasById = query({
  args: {
    id: v.id('canvas'),
  },
  handler: async (ctx, args) => {
    if (!args.id) return;
    return await ctx.db.get(args.id);
  },
});
