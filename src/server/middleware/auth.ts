import { Request, Response, NextFunction } from 'express';

import * as e from '../../shared/errors';
import * as userService from '../../services/user';
import * as tokenService from '../../services/token';

const JWT_REGEX = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

function _extractFromHeader(req: Request): string | undefined {
  const header: string | undefined = req.get('Authorization');

  if (!header) {
    return undefined;
  }

  if (!JWT_REGEX.test(header)) {
    return undefined;
  }

  return header;
}

function _extractFromQuery(req: Request): string | undefined {
  if (!req.query) {
    return undefined;
  }

  const { jwt } = req.query;

  if (!jwt || typeof jwt !== 'string' || !JWT_REGEX.test(jwt)) {
    return undefined;
  }

  return jwt;
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const jwt = _extractFromHeader(req) || _extractFromQuery(req);

  if (!jwt) {
    const message = `Invalid JWT!`;
    next(new e.ClientError(message));
    return;
  }

  req.body.user = await userService.findUserByJWT(jwt);
  req.body.token = await tokenService.findTokenByJWT(jwt);

  next();
}
