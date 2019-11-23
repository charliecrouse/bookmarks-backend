import * as argon2 from 'argon2';

import { InternalError } from './errors';

export const encrypt = async (s: string): Promise<string> => {
  try {
    return await argon2.hash(s, { type: argon2.argon2id });
  } catch (err) {
    return Promise.reject(new InternalError(err));
  }
};

export const verify = async (encrypted: string, plain: string): Promise<boolean> => {
  try {
    return await argon2.verify(encrypted, plain, { type: argon2.argon2id });
  } catch (err) {
    return Promise.reject(new InternalError(err));
  }
};
