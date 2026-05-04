import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import * as z from 'zod';
import { DomainError } from '../errors/domainError';

const errorStatusCodes: Record<string, number> = {
  EntityNotFoundError: status.NOT_FOUND,
  BusinessConflictError: status.CONFLICT,
  UnauthorizedError: status.UNAUTHORIZED,
  ForbiddenOperationError: status.FORBIDDEN,
};

export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof DomainError) {
    const statusCode =
      errorStatusCodes[error.name] || status.INTERNAL_SERVER_ERROR;

    res.status(statusCode).json({ error: error.message });
    return;
  }

  if (error instanceof z.ZodError) {
    res.status(status.BAD_REQUEST).json({ error: 'Datos inválidos' });
    return;
  }

  console.error('[ERROR NO CONTROLADO]:', error);

  // Respuesta genérica para no exponer detalles técnicos
  res.status(status.INTERNAL_SERVER_ERROR).json({
    error: 'Algo salió mal, inténtalo más tarde',
  });
};
