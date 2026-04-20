import * as zod from 'zod';

export const authBodyValidator = zod.object({
  username: zod.string(),
  email: zod.email(),
  password: zod.string(),
});
