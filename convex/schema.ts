import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  canvas: defineTable({
    elements: v.array(
      v.object({
        id: v.number(),
        x1: v.number(),
        y1: v.number(),
        x2: v.number(),
        y2: v.number(),
        mode: v.string(),
      }),
    ),
    docContent: v.string(),
    userId: v.string(),
  }),
});
