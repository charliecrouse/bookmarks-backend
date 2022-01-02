import config from 'config';
import addMinutes from 'date-fns/addMinutes';
import { sign, verify, JwtPayload } from 'jsonwebtoken';

import * as e from '@utils/error';
import { Token, TokenProps } from '@models/token';
import { findUserByEmail } from '@controllers/user';

const JWT_SECRET = config.get<string>('jwt.secret');

export const createToken = async (ownerEmail: string, role = 'user'): Promise<TokenProps> => {
  // Verify that a User exists with the given email
  await findUserByEmail(ownerEmail);

  const payload: JwtPayload = {
    role,
    exp: addMinutes(new Date(), 30).valueOf(),
  };

  return Token.insertOne({
    ownerEmail,
    jwt: sign(payload, JWT_SECRET),
  });
};

export const findTokenByJWT = async (jwt: string): Promise<TokenProps> => {
  const token = await Token.findOne({ jwt });

  if (!token) {
    const message = `Failed to find Token for the given JWT, "${jwt}"`;
    return Promise.reject(new e.ClientError(message, 401));
  }

  const tokenIsExpired = isTokenExpired(token);

  if (tokenIsExpired) {
    const message = `Failed to find valid Token for the given JWT, "${jwt}"`;
    return Promise.reject(new e.ClientError(message, 401));
  }

  return token;
};

const getDecoded = (token: TokenProps): JwtPayload => {
  return verify(token.jwt, JWT_SECRET) as JwtPayload;
};

const getExp = (token: TokenProps): Date => {
  const { exp } = getDecoded(token);

  if (exp) {
    return new Date(exp);
  }

  return new Date();
};

const isTokenExpired = (token: TokenProps): boolean => {
  const exp = getExp(token);
  return exp <= new Date();
};
