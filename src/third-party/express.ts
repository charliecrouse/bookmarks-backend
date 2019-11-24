import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import compression from 'compression';

import { router } from '../routes';
import { errorMiddleware } from '../middleware/error';

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
