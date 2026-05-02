import status from 'http-status';
import * as z from 'zod';
import { NextFunction, Request, Response } from 'express';
import { DomainError } from '../errors/domainError';

const ErrorStatusCodes: Record<string, number> = {
  EntityNotFoundError: status.NOT_FOUND, // 404
  BusinessConflictError: status.CONFLICT, // 409
  UnauthorizedError: status.UNAUTHORIZED, // 401
  ForbiddenOperationError: status.FORBIDDEN, // 403
};

export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof DomainError) {
    const statusCode = ErrorStatusCodes[error.name] || status.INTERNAL_SERVER_ERROR; // 500
    res.status(statusCode).json({ error: error.message });
    return;
  }

  if (error instanceof z.ZodError) {
    res.status(status.BAD_REQUEST).json({ error: 'Datos inválidos' });
    return;
  }

  console.error('[ERROR NO CONTROLADO]:', error);

  // Las respuestas de error usan siempre la clave `error`.
  res.status(status.INTERNAL_SERVER_ERROR).json({
    error: 'Algo salió mal, inténtalo más tarde',
  });
};
