import * as validator from 'validator';

import * as crypto from '../shared/crypto';
import * as e from '../shared/errors';
import { User } from '../models/user';
import { findTokenByJWT } from './token';

interface CreateUserProps {
  email: string;
  password: string;
}

export async function createUser({ email, password }: CreateUserProps): Promise<User> {
  const existing = await User.findByPk(email);

  if (existing) {
    const message = `A user with the given email, "${email}", already exists!`;
    return Promise.reject(new e.ClientError(message));
  }

  if (!validator.isEmail(email)) {
    const message = `The given email, "${email}", is invalid!`;
    return Promise.reject(new e.ClientError(message));
  }

  const user = new User({
    email,
    password: await crypto.encrypt(password),
  });

  return await user.save();
}

export async function findUserByEmail(email: string): Promise<User> {
  const user = await User.findByPk(email);

  if (!user) {
    const message = `Failed to find user with the given email, "${email}"!`;
    return Promise.reject(new e.ClientError(message));
  }

  return user;
}

export async function findUserByCredentials(email: string, password: string): Promise<User> {
  const user = await findUserByEmail(email);

  const hasValidCredentials = await crypto.verify(user.password, password);

  if (!hasValidCredentials) {
    const message = `Incorrect password for the given email, "${email}"!`;
    return Promise.reject(new e.ClientError(message));
  }

  return user;
}

export async function findUserByJWT(jwt: string): Promise<User> {
  const token = await findTokenByJWT(jwt);
  return await findUserByEmail(token.ownerEmail);
}
