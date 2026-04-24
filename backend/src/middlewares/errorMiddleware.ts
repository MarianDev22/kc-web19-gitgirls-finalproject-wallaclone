import status from 'http-status';
import * as z from 'zod';
import { NextFunction, Request, Response } from 'express';
import { DomainError } from '../errors/domainError';

const ErrorStatusCodes: Record<string, number> = {
  EntityNotFoundError: status.NOT_FOUND, // 404

  BusinessConflictError: status.CONFLICT, // 409

  UnauthorizedError: status.UNAUTHORIZED, // 401

  ForbiddeOperationError: status.FORBIDDEN, // 403
};

export const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof DomainError) {
    const statusCode = ErrorStatusCodes[error.name] || 500;
    res.status(statusCode).json({ error: error.message });
    return;

  } else if (error instanceof z.ZodError) {
    const errorMessage = "Datos inválidos";
    res.status(status.BAD_REQUEST).json({ error: errorMessage });
    return;
  }

  console.error(" [ERROR NO CONTROLADO]:", error);
  res.status(status.INTERNAL_SERVER_ERROR).json({
    error: "Algo salió mal, inténtalo más tarde",
  });
};
