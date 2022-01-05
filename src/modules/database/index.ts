import { connect } from '@modules/database/papr';

export const bootstrapDatabase = async () => {
  await connect();
};
