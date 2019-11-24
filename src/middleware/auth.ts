import express from 'express';

import * as userService from '../services/user';
import * as tokenService from '../services/token';

export const authMiddleware = (roles: string[] = ['user', 'admin']) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const header: string | undefined = req.get('Authorization');
    const param: string = req.query.jwt || '';

    const jwt = header ? header.split(' ')[1] : param;

    try {
      req.body.token = await tokenService.findTokenByJWT(jwt);
      req.body.user = await userService.findUserByJWT(jwt);
      return next();
    } catch (err) {
      return next(err);
    }
  };
};
