import * as jwt from 'jsonwebtoken';
import addMinutes from 'date-fns/addMinutes';

import * as e from '../shared/errors';
import { Token } from '../models/token';
import { findUserByEmail } from './user';

export async function createToken(ownerEmail: string, role = 'user'): Promise<Token> {
  // Verify that the email belongs to a valid user
  await findUserByEmail(ownerEmail);

  const secret = Token.getSecret();
  const expires: Date = addMinutes(new Date(), 30);

  const token = new Token({
    jwt: jwt.sign({ role, expires }, secret),
    ownerEmail,
  });
  return await token.save();
}

export async function findTokenByJWT(jwt: string): Promise<Token> {
  const token = await Token.findByPk(jwt);

  if (!token) {
    const message = `Failed to find a valid Token for the given JWT, "${jwt}"!`;
    return Promise.reject(new e.ClientError(message));
  }

  if (token.isExpired) {
    const message = `The given JWT, "${jwt}" has expired. Please re-authenticate!`;
    return Promise.reject(new e.ClientError(message));
  }

  return token;
}
