import { Request, Response, NextFunction } from 'express';

import * as e from '@utils/error';

export const handleErrors = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  let statusCode = 500;
  let message = 'Something went wrong! Please try again.';

  if (err instanceof e.ClientError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  console.log(JSON.stringify(err, null, 2));
  res.status(statusCode).send({ message });
};
