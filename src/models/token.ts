import { Db } from 'mongodb';
import { types, schema } from 'papr';
import { papr } from '@modules/database/papr';

const tokenSchema = schema(
  {
    // --------------------
    // Properties
    // --------------------
    jwt: types.string({ required: true }),

    // --------------------
    // Relations
    // --------------------
    ownerEmail: types.string({ required: true }),
  },
  { timestamps: false },
);

export const Token = papr.model('tokens', tokenSchema);

export type TokenProps = typeof tokenSchema[0];
export type TokenCreationProps = Optional<TokenProps, '_id'>;

export const createTokenIndexes = async (db: Db) => {
  await db.createIndex(
    'tokens',
    {
      jwt: 1,
    },
    { unique: true, expireAfterSeconds: 60 * 30 },
  );
};
