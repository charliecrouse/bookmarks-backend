import express from 'express';

import * as errors from '../utils/errors';

export const errorMiddleware = (
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  let statusCode: number = 500;
  let message: string = 'Something went wrong! Please try again.';

  if (err instanceof errors.ClientError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  console.log(err);
  return res.status(statusCode).send({ error: message });
};
