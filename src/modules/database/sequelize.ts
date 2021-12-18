import config from 'config';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';

const ENV = process.env['NODE_ENV'] || 'development';
const DATABASE_NAME = `bookmarks-${ENV}`.toLowerCase();

const DEFAULT_DATABASE_CONFIG: Partial<SequelizeOptions> = {
  database: DATABASE_NAME,
  models: [],
};

const DEVELOPMENT_DATABASE_CONFIG: SequelizeOptions = Object.assign({}, DEFAULT_DATABASE_CONFIG, {
  dialect: 'postgres',
  host: process.env['DOCKER'] ? 'postgres' : 'localhost',
  username: config.get<string>('database.username'),
  password: config.get<string>('database.password'),
});

const PRODUCTION_DATABASE_CONFIG: SequelizeOptions = Object.assign({}, DEFAULT_DATABASE_CONFIG, {
  dialect: 'postgres',
  // TODO: load production credentials w/ secrets manager
  host: config.get<string>('database.host'),
  username: config.get<string>('database.username'),
  password: config.get<string>('database.password'),
});

const TEST_DATABASE_CONFIG: SequelizeOptions = Object.assign({}, DEFAULT_DATABASE_CONFIG, {
  dialect: 'sqlite',
  storage: ':memory:',
  username: config.get<string>('database.username'),
  password: config.get<string>('database.password'),
});

const options: Record<string, SequelizeOptions> = {
  production: PRODUCTION_DATABASE_CONFIG,
  development: DEVELOPMENT_DATABASE_CONFIG,
  test: TEST_DATABASE_CONFIG,
};

if (!options[ENV]) {
  throw new Error(`Unsupported environment ${ENV}`);
}

const sequelize = new Sequelize(options[ENV]);
