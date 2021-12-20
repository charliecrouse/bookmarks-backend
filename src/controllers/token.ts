import addMinutes from 'date-fns/addMinutes';
import { sign, JwtPayload } from 'jsonwebtoken';

import * as e from '@utils/error';
import { Token } from '@models/token';
import { findUserByEmail } from '@controllers/user';

export const createToken = async (ownerEmail: string, role = 'user'): Promise<Token> => {
  // Verify that a User exists with the given email
  await findUserByEmail(ownerEmail);

  const payload: JwtPayload = {
    role,
    exp: addMinutes(new Date(), 30).valueOf(),
  };

  const token = new Token({
    ownerEmail,
    jwt: sign(payload, Token.secret),
  });

  return token.save();
};

export const findTokenByJWT = async (jwt: string): Promise<Token> => {
  const token = await Token.findByPk(jwt, { raw: true });

  if (!token) {
    const message = `Failed to find Token for the given JWT, "${jwt}"`;
    return Promise.reject(new e.ClientError(message, 401));
  }

  if (token.isExpired) {
    const message = `Failed to find valid Token for the given JWT, "${jwt}"`;
    return Promise.reject(new e.ClientError(message, 401));
  }

  return token;
};
