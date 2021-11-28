import { Sequelize } from 'sequelize-typescript';

import { Bookmark, Token, User } from '../models';

const isTestingDatabase = (databaseURI: string): boolean => /test/i.test(databaseURI);
const isDevelopmentDatabase = (databaseURI: string): boolean => /development/i.test(databaseURI);

export const validateDatabaseURI = (env: string, databaseURI: string): void => {
  if (env === 'test' && !isTestingDatabase(databaseURI)) {
    throw new Error(`Refusing to connect to non-testing database in test env ${databaseURI}`);
  }

  if (env === 'development' && !isDevelopmentDatabase(databaseURI)) {
    throw new Error(
      `Refusing to connect to non-development database in development env ${databaseURI}`,
    );
  }
};

export async function connectToDatabase(): Promise<Sequelize> {
  const env = process.env.NODE_ENV || 'development';
  const databaseURI: string =
    process.env.DATABASE_URI ||
    `postgres://postgres:password@postgres:5432/bookmarks-backend-${env.toLowerCase()}`;
  validateDatabaseURI(env, databaseURI);

  const sequelize = new Sequelize(databaseURI, {
    dialect: 'postgres',
    logging: false,
  });

  sequelize.addModels([Bookmark, Token, User]);

  await sequelize.sync();
  return sequelize;
}
