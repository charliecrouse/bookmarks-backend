import * as jwt from 'jsonwebtoken';

import addMinutes from 'date-fns/addMinutes';

import * as userService from '../services/user';
import * as errors from '../utils/errors';

import { Token } from '../models/token';

export const createToken = async (ownerEmail: string, role = 'user'): Promise<Token> => {
  await userService.findUserByEmail(ownerEmail);

  const secret = Token.getSecret();
  const expires = addMinutes(new Date(), 30);

  const token = new Token({
    jwt: jwt.sign({ role, expires }, secret),
    ownerEmail,
  });

  return await token.save();
};

export const findTokenByJWT = async (jwt: string): Promise<Token> => {
  const token = await Token.findByPk(jwt);

  if (!token) {
    const error = new errors.ClientError(`No token exists with the given JWT, ${jwt}!`, 400);
    return Promise.reject(error);
  }

  if (token.isExpired) {
    const error = new errors.ClientError(
      `The given JWT, ${jwt}, has expired. Please re-authenticate!`,
      400,
    );
    await token.destroy();
    return Promise.reject(error);
  }

  return token;
};
