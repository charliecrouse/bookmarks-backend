import '@babel/polyfill';
import 'reflect-metadata';

import { createApp, getPort } from './third-party/express';
import { createDatabaseConnection } from './third-party/sequelize';

const main = async () => {
  // Connect to database
  const database = createDatabaseConnection();
  await database.sync();
  console.log('Successfully connected to database');

  // Start express server
  const app = createApp();
  const port = getPort();

  await app.listen(port);
  console.log(`Express server is listening at http://localhost:${port}`);
};

if (!module.parent) {
  main();
}
