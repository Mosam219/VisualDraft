import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema(
  {
    project: defineTable({
      elements: v.array(
        v.object({
          id: v.number(),
          x1: v.number(),
          y1: v.number(),
          x2: v.number(),
          y2: v.number(),
          mode: v.string(),
          text: v.optional(v.string()),
        }),
      ),
      teamsId: v.id('teams'),
      createdBy: v.string(),
      docContent: v.string(),
      name: v.string(),
    }),
    teams: defineTable({
      name: v.string(),
      createdBy: v.string(),
      projects: v.array(v.id('project')),
    }),
    users: defineTable({
      name: v.string(),
      email: v.string(),
      image: v.string(),
    }),
  },
  {
    schemaValidation: false,
  },
);
