import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const securityService = {
  hashPassword: async (clearPassword: string) => {
    const hashedPassword = await bcrypt.hash(clearPassword, 7);

    return hashedPassword;
  },

  generateJWT: (userId: string) => {
    const secret = process.env.JWT_SECRET || 'T3mpKey';
    const token = jwt.sign({ userId }, secret, {
      expiresIn: '1h',
    });
    return token;
  },
};
