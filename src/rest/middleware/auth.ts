import { Request, Response, NextFunction } from 'express';

import * as e from '@utils/error';
import { findUserByEmail } from '@controllers/user';
import { findTokenByJWT } from '@controllers/token';

const AUTH_TYPE = 'Basic';
const VALID_JWT_REGEX = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

const getFromHeader = (req: Request): Maybe<string> => {
  const header = req.get('Authorization');
  if (!header) return null;

  const [type, credentials] = header.split(' ');

  if (!type || type.toLowerCase() !== AUTH_TYPE.toLowerCase()) return null;
  if (!credentials || !VALID_JWT_REGEX.test(credentials)) return null;

  return credentials;
};

const getFromQuery = (req: Request, param: string): Maybe<string> => {
  if (!req.query) return null;

  const credentials: string = req.query[param] as string;
  if (!credentials || !VALID_JWT_REGEX.test(credentials)) return null;

  return credentials;
};

export const wrapAuth = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  const jwt: Maybe<string> =
    getFromHeader(req) || getFromQuery(req, 'jwt') || getFromQuery(req, 'token');

  if (!jwt) {
    const message = `Request is missing valid authentication!`;
    next(new e.ClientError(message, 403));
    return;
  }

  const token = await findTokenByJWT(jwt);
  const user = await findUserByEmail(token.ownerEmail);

  req.body.user = user;
  req.body.ownerEmail = user.email;
  req.body.token = token;
  next();
};
