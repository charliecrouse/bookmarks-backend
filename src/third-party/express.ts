import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import compression from 'compression';

import { router } from '../routes';
import { errorMiddleware } from '../middleware/error';

const registerMiddleware = (app: express.Application): void => {
  // Enable compression
  app.use(compression());

  // Enable request body
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // Enable cors
  app.use(cors());

  // Logger
  app.use(morgan('dev'));

  // Register Last
  app.use(router);
  app.use(errorMiddleware);
};

export const getPort = (): number => {
  return parseInt(process.env.PORT || '3000');
};

export const createApp = (): express.Application => {
  const app = express();

  registerMiddleware(app);
  return app;
};
