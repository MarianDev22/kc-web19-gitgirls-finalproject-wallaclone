import * as z from 'zod';

export const createAdBodyValidator = z.object({
  name: z.string(),
  description: z.string().max(200),
  price: z.coerce.number(),
  isSale: z.coerce.boolean(),
  image: z.string().optional(),
  tags: z.string().array().optional(),
});
