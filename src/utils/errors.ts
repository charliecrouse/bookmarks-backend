class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InternalError extends CustomError {
  constructor(error: Error) {
    super(error.message);
  }
}

export class ClientError extends CustomError {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ValidationError extends ClientError {
  constructor(message: string) {
    super(message, 400);
  }
}
