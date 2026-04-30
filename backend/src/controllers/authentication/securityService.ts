import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../../errors/domainError';

export const securityService = {
  hashPassword: async (clearPassword: string) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(clearPassword, salt);

    return hashedPassword;
  },

  generateJWT: (userId: string) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is required in .env file');
    }
    const token = jwt.sign({ userId }, secret, {
      expiresIn: '1h',
    });
    return token;
  },

  comparePasswords: async (incomingPassword: string, userPassword: string) => {
    const isMatch = await bcrypt.compare(incomingPassword, userPassword);

    if (!isMatch) {
      throw new UnauthorizedError('Credenciales incorrectas');
    }

    return isMatch;
  },
};
