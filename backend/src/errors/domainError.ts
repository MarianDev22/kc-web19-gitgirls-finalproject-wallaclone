export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name; // Esto hace que el nombre sea "EntityNotFoundError", etc.
    Object.setPrototypeOf(this, DomainError.prototype);
  }
}

export class EntityNotFoundError extends DomainError {
  readonly name = 'EntityNotFoundError';

  constructor(entity: string, id: string) {
    super(`No se ha encontrado ${entity} con id ${id}`);
  }
}

export class BusinessConflictError extends DomainError {
  readonly name = 'BusinessConflictError';

  constructor(message = 'Conflicto en la operación') {
    super(message);
  }
}

export class UnauthorizedError extends DomainError {
  readonly name = 'UnauthorizedError';

  constructor(message = 'No autorizado') {
    super(message);
  }
}

export class ForbiddenOperationError extends DomainError {
  readonly name = 'ForbiddenOperationError';

  constructor(message = 'Operación no permitida') {
    super(message);
  }
}
