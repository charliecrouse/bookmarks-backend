import express from 'express';
import bodyparser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';

import { router } from '@rest/routes';
import { handleErrors } from '@rest/middleware/error';

const ENV: string = process.env['NODE_ENV'] || 'development';

const LOGGING_STYLE_MAP: Record<string, string> = {
  development: 'dev',
  test: 'tiny',
  production: 'common',
};
const LOGGING_STYLE: string = LOGGING_STYLE_MAP[ENV] || 'dev';

export const app = express();

app.use(compression());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors());
app.use(morgan(LOGGING_STYLE));

app.use(router);
app.use(handleErrors);
