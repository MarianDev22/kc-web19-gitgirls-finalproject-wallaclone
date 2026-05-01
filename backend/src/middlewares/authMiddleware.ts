import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/domainError';
import { securityService } from '../controllers/authentication/securityService';

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authenticationHeader = req.headers.authorization; // Authorization: Bearer <token>

    if (!authenticationHeader) {
      throw new UnauthorizedError('Falta la cabecera de autorización');
    }

    const [scheme, token] = authenticationHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedError('Formato de autorización inválido');
    }

    const data = securityService.verifyJWT(token);

    req.user = {
      id: data.userId,
    };

    next();
  } catch (error) {
    next(error);
  }
};
