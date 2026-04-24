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
    super(`${entity} with id ${id} could not be found`);
  }
}
export class BusinessConflictError extends DomainError {
  readonly name = 'BusinessConflictError';
  constructor(message = 'conflict') {
    super(message);
  }
}
export class UnauthorizedError extends DomainError {
  readonly name = 'UnauthorizedError';//401
  constructor(message = 'unauthorized error') {
    super(message);
  }
}

export class ForbiddenOperationError extends DomainError {
  readonly name = 'ForbiddenOperationError';//403
  constructor(message = 'operation not allowed') {
    super(message);
  }
}