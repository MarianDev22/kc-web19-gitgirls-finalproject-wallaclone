import * as zod from 'zod';

export const authSignupValidator = zod.object({
  username: zod.string().trim().min(1),
  email: zod.string().trim().toLowerCase().pipe(zod.email()),
  password: zod.string().min(6).max(64),
});

export const authLoginValidator = zod.object({
  username: zod.string().trim().min(1),
  password: zod.string().min(6).max(64),
});
