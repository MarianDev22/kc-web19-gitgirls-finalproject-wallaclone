import * as z from 'zod';

export const createAdBodyValidator = z.object({
  name: z.string().trim().min(5),
  description: z.string().trim().min(5).max(200),
  price: z.coerce.number().positive({message: "El precio tiene que ser mayor a cero"}),
  isSale: z.boolean(),
  image: z.url(),
  tags: z.array(z.string().trim().min(1)).optional(),
});
