import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/domainError';
import { securityService } from '../controllers/authentication/securityService';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authenticationHeader = req.headers.authorization; // Bearer JWT_SECRET
  const token = authenticationHeader?.split(' ')[1];
  if (!token) {
    throw new UnauthorizedError(`Error getting jwt token from Authorization header`);
  }

  //verify token

  const data = securityService.verifyJWT(token);

  req.user = {
    id: data.userId,
  };
  next();
};
