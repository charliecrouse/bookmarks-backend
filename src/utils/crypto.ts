import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const MIN_PASSWORD_LENGTH = 5;
export const MAX_PASSWORD_LENGTH = 128;

export const encrypt = async (plaintext: string): Promise<string> => {
  return bcrypt.hash(plaintext, SALT_ROUNDS);
};

export const verify = async (plaintext: string, encrypted: string): Promise<boolean> => {
  return bcrypt.compare(plaintext, encrypted);
};
