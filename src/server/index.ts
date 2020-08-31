import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import express, { Application } from 'express';
import morgan from 'morgan';

import { errorMiddleware } from './middleware';
import { router } from '../api';

function _configureApplication(app: Application): void {
  const port: number = +(process.env.PORT || 8000);
  app.set('PORT', port);
}

function _registerMiddleware(app: Application): void {
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cors());
  app.use(morgan('dev'));

  // Must remain in the same order
  app.use(router);
  app.use(errorMiddleware);
}

export function createApp(): Application {
  const app: Application = express();

  _configureApplication(app);
  _registerMiddleware(app);

  app.get('/healthcheck', (_req, res) => {
    res.status(200).send();
  });

  return app;
}
