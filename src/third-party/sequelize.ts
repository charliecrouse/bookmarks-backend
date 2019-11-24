import { Sequelize } from 'sequelize-typescript';
import { Bookmark } from '../models/bookmark';
import { Token } from '../models/token';
import { User } from '../models/user';

export const createDatabaseConnection = (): Sequelize => {
  const sequelize = new Sequelize('postgres', 'postgres', '', {
    dialect: 'postgres',
    logging: false,
  });

  sequelize.addModels([Bookmark, Token, User]);
  return sequelize;
};
