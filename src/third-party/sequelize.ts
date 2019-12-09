import { Sequelize } from 'sequelize-typescript';
import { Bookmark } from '../models/bookmark';
import { Token } from '../models/token';
import { User } from '../models/user';

// Determine if executing in a docker container
const DOCKER = (process.env.DOCKER || 'false').toLowerCase() === 'true';

const getPostgresHost = (): string => {
  const host = process.env.POSTGRES_HOST;

  if (host) {
    return host;
  }

  if (DOCKER) {
    return 'bookmarks-postgres';
  }

  return '0.0.0.0';
};

const getPostgresUsername = (): string => {
  const username = process.env.POSTGRES_USERNAME;

  if (username) {
    return username;
  }

  return 'postgres';
};

const getPostgresPassword = (): string => {
  const password = process.env.POSTGRES_PASSWORD;

  if (password) {
    return password;
  }

  return '';
};

const getPostgresDatabase = (): string => {
  const database = process.env.POSTGRES_DATABASE;

  if (database) {
    return database;
  }

  return 'postgres';
};

export const createDatabaseConnection = (): Sequelize => {
  const sequelize = new Sequelize({
    host: getPostgresHost(),
    username: getPostgresUsername(),
    password: getPostgresPassword(),
    database: getPostgresDatabase(),
    dialect: 'postgres',
    logging: false,
  });

  sequelize.addModels([Bookmark, Token, User]);
  return sequelize;
};
