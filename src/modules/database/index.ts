import { sequelize } from './sequelize';

export const bootstrapDatabase = async () => {
  await sequelize.sync();
}
