import * as argon2 from 'argon2';

import * as e from './errors';

const CRYPTO_OPTIONS = {
  type: argon2.argon2id,
};

export async function encrypt(s: string): Promise<string> {
  try {
    return await argon2.hash(s, CRYPTO_OPTIONS);
  } catch (err) {
    return Promise.reject(new e.InternalError(err.message));
  }
}

export async function verify(encrypted: string, plaintext: string): Promise<boolean> {
  try {
    return await argon2.verify(encrypted, plaintext, CRYPTO_OPTIONS);
  } catch (err) {
    return Promise.reject(new e.InternalError(err.message));
  }
}
