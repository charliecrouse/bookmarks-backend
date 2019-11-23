import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import compression from 'compression';

import * as errors from '../utils/errors';
import { router } from '../routes';

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

const registerMiddleware = (app: express.Application) => {
  // Enable compression
  app.use(compression());

  // Enable request body
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // Logger
  app.use(morgan('dev'));

  // Register Last
  app.use(router);
  app.use(errorMiddleware);
};

export const createApp = (): express.Application => {
  const app = express();

  const port: Number = parseInt(process.env.PORT || '3000');
  app.set('PORT', port);

  registerMiddleware(app);

  return app;
};
