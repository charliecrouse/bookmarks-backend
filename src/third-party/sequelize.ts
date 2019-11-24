import { Sequelize } from 'sequelize-typescript';
import { Bookmark } from '../models/bookmark';
import { Token } from '../models/token';
import { User } from '../models/user';

export const createDatabaseConnection = (): Sequelize => {
  /*
  const sequelize = new Sequelize('bookmarks-postgres', 'postgres', '', {
    dialect: 'postgres',
    logging: false,
  });
  */

  const host = process.env.NODE_ENV === 'production' ? 'bookmarks-postgres' : '0.0.0.0';

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
