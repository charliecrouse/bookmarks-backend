import { sequelize } from '@modules/database/sequelize';

export const bootstrapDatabase = async () => {
  await sequelize.sync();
};
