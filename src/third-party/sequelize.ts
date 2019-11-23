import * as path from 'path';

import { Sequelize } from 'sequelize-typescript';
import { Token } from '../models/token';
import { User } from '../models/user';

export const MODEL_PATHS = path.join(__dirname, '..', 'models');

export const createDatabaseConnection = (): Sequelize => {
  const sequelize = new Sequelize('postgres', 'postgres', '', {
    dialect: 'postgres',
    logging: false,
  });

  sequelize.addModels([Token, User]);
  return sequelize;
};
