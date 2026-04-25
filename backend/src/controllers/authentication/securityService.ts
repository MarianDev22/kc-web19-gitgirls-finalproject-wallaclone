import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../../errors/domainError';

export const securityService = {
  hashPassword: async (clearPassword: string) => {
    const hashedPassword = await bcrypt.hash(clearPassword, 7);

    return hashedPassword;
  },

  generateJWT: (userId: string) => {
    const jwtSecret = process.env.JWT_SECRET || 'T3mpKey';
    const token = jwt.sign({ userId }, jwtSecret, {
      expiresIn: '1h',
    });
    return token;
  },

  comparePasswords: async (incomingPassword: string, userPassword: string) => {
    const isMatch = await bcrypt.compare(incomingPassword, userPassword);

    if (!isMatch) {
      throw new UnauthorizedError('Contraseña inválida');
    }

    return isMatch;
  },

  verifyJWT: (token:string):{userId:string} => {
    const jwtSecret = process.env.JWT_SECRET || 'T3mpKey';
    try {
      const data = jwt.verify(token, jwtSecret) as {userId:string} ;
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'jwt.verify error';
      throw new UnauthorizedError(`Error verifying JWT: ${errorMessage}`);
    }
  },

};

