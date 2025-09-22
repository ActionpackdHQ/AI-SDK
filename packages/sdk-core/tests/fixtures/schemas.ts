import { z } from 'zod';

export const ProductSchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
  inStock: z.boolean(),
});

export const StorySchema = z.object({
  title: z.string(),
  content: z.string(),
  genre: z.enum(['fiction', 'non-fiction']),
});

export const IntentSchema = z.object({
  intent: z.enum(['purchase', 'inquiry', 'support']),
  confidence: z.number().min(0).max(1),
  entities: z.array(z.object({
    type: z.string(),
    value: z.string(),
  })),
});
