import { Sequelize } from 'sequelize-typescript';
import { Bookmark } from '../models/bookmark';
import { Token } from '../models/token';
import { User } from '../models/user';

const DOCKER = (process.env.DOCKER || "false").toLowerCase() === "true"

export const createDatabaseConnection = (): Sequelize => {
  const host = DOCKER ? 'bookmarks-postgres' : '0.0.0.0';

  const sequelize = new Sequelize({
    host,
    username: 'postgres',
    password: '',
    database: 'postgres',
    dialect: 'postgres',
    logging: false,
  });

  sequelize.addModels([Bookmark, Token, User]);
  return sequelize;
};
