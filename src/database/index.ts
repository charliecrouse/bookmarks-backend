import { Sequelize } from 'sequelize-typescript';

import { Bookmark, Token, User } from '../models';

export async function connectToDatabase(): Promise<Sequelize> {
  if (!process.env.DATABASE_URI) {
    throw new Error(`Missing environment variable DATABASE_URI`);
  }

  const uri = process.env.DATABASE_URI;

  const sequelize = new Sequelize(uri, {
    dialect: 'postgres',
    logging: false,
  });

  sequelize.addModels([Bookmark, Token, User]);

  await sequelize.sync();
  return sequelize;
}
