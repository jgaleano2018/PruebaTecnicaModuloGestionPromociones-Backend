export abstract class DomainException extends Error {
  public abstract readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BusinessRuleValidationException extends DomainException {
  public readonly statusCode = 400;

  constructor(message: string) {
    super(message);
  }
}

export class PromotionNotFoundException extends DomainException {
  public readonly statusCode = 404;

  constructor(id: number) {
    super(`No se encontró la promoción con ID: ${id}`);
  }
}

export class InvalidPromotionStateException extends DomainException {
  public readonly statusCode = 422;

  constructor(message: string) {
    super(message);
  }
}
