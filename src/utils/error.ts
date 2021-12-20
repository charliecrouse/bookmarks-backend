class CustomError extends Error {}

export class InternalError extends CustomError {
  constructor(error: Error) {
    super(error.message);
  }
}

export class ClientError extends CustomError {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ValidationError extends ClientError {
  constructor(message: string) {
    super(message, 400);
  }
}
