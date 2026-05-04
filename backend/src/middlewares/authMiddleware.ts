import { NextFunction, Request, Response } from 'express';
import { securityService } from '../controllers/authentication/securityService';
import { UnauthorizedError } from '../errors/domainError';

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  try {
    // Formato esperado: Authorization: Bearer <token>
    const authenticationHeader = req.headers.authorization;

    if (!authenticationHeader) {
      throw new UnauthorizedError('Falta la cabecera de autorización');
    }

    const [scheme, token, extra] = authenticationHeader.split(' ');

    if (scheme !== 'Bearer' || !token || extra) {
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
