import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../../errors/domainError';

const getJWTSecret = () => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET no está configurado en las variables de entorno');
  }

  return jwtSecret;
};

export const securityService = {
  hashPassword: async (clearPassword: string) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(clearPassword, salt);

    return hashedPassword;
  },

  generateJWT: (userId: string) => {
    const jwtSecret = getJWTSecret();
    const token = jwt.sign({ userId }, jwtSecret, {
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

  verifyJWT: (token: string): { userId: string } => {
    const jwtSecret = getJWTSecret();

    try {
      const data = jwt.verify(token, jwtSecret) as { userId: string };

      return data;
    } catch {
      // Para no exponer detalles internos del token
      throw new UnauthorizedError('Token de autenticación inválido');
    }
  },
};
