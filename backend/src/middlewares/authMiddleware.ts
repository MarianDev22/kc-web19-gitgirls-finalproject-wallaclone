import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/domainError';
import { securityService } from '../controllers/authentication/securityService';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authenticationHeader = req.headers.authorization; // Authorization: Bearer <token>

    if (!authenticationHeader) {
      throw new UnauthorizedError('Authorization header missing');
    }

    const [scheme, token] = authenticationHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedError('Invalid authorization format');
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
