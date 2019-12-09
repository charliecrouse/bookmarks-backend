import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import https from 'https';
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

export const createApp = (): https.Server => {
  const app = express();

  registerMiddleware(app);

  const sslPath = path.join(os.homedir(), '.config', 'ssl');
  const sslCertPath = path.join(sslPath, 'server.cert');
  const sslKeyPath = path.join(sslPath, 'server.key');

  const cert = fs.readFileSync(sslCertPath, 'utf8');
  const key = fs.readFileSync(sslKeyPath, 'utf8');

  return https.createServer(
    {
      cert,
      key,
    },
    app,
  );
};
