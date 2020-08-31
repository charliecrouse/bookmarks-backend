import { Request, Response, NextFunction } from 'express';

import * as e from '../../shared/errors';

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void {
  let statusCode = 500;
  let message = 'Something went wrong! Please try again.';

  if (err instanceof e.ClientError) {
    message = err.message;
    statusCode = err.statusCode;
  }

  console.error(err.toString());
  res.status(statusCode).send({ message });
}
