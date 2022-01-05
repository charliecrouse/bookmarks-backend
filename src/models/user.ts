import { Db } from 'mongodb';
import { schema, types } from 'papr';
import { papr } from '@modules/database/papr';

const userSchema = schema(
  {
    // --------------------
    // Properties
    // --------------------
    email: types.string({ required: true }),
    password: types.string({ required: true }),
  },
  { timestamps: true },
);

export const User = papr.model('users', userSchema);

export type UserProps = typeof userSchema[0];
export type UserCreationProps = Optional<UserProps, '_id'>;

export const createUserIndexes = async (db: Db) => {
  await db.createIndex(
    'users',
    {
      email: 1,
    },
    { unique: true },
  );
};
