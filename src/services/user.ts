import * as crypto from '../utils/crypto';
import * as errors from '../utils/errors';

import * as tokenService from './token';
import { User, UserShape } from '../models/user';

export const createUser = async ({ email, password }: UserShape): Promise<User> => {
  const existing = await User.findByPk(email);

  if (existing) {
    const error = new errors.ClientError(
      `A user already exists with the given email, ${email}`,
      400,
    );
    return Promise.reject(error);
  }

  const user = new User({
    email,
    password: await crypto.encrypt(password),
  });

  return await user.save();
};

export const findUserByEmail = async (email: string): Promise<User> => {
  const user = await User.findByPk(email);

  if (!user) {
    const error = new errors.ClientError(`No user exists with the given email, ${email}!`, 400);
    return Promise.reject(error);
  }

  return user;
};

export const findUserByCredentials = async (email: string, password: string): Promise<User> => {
  const user = await findUserByEmail(email);
  const hasValidCredentials = await crypto.verify(user.password, password);

  if (!hasValidCredentials) {
    const error = new errors.ClientError(
      `Invalid credentials for the given email, ${email}!`,
      400,
    );
    return Promise.reject(error);
  }

  return user;
};

export const findUserByJWT = async (jwt: string): Promise<User> => {
  const token = await tokenService.findTokenByJWT(jwt);
  const user = await findUserByEmail(token.ownerEmail);
  return user;
};
