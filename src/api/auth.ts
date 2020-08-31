import { Router, Request, Response } from 'express';

import * as userService from '../services/user';
import * as tokenService from '../services/token';

import { asyncMiddleware } from '../server/middleware/async';
import { authMiddleware } from '../server/middleware/auth';

export const router = Router();

router.post(
  '/signup',
  asyncMiddleware(async (req: Request, res: Response) => {
    const user = await userService.createUser(req.body);
    const token = await tokenService.createToken(user.email);

    return res.status(201).json(token);
  }),
);

router.post(
  '/signin',
  asyncMiddleware(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await userService.findUserByCredentials(email, password);
    const token = await tokenService.createToken(user.email);

    return res.json(token);
  }),
);

router.post(
  '/refresh',
  asyncMiddleware(authMiddleware),
  asyncMiddleware(async (req: Request, res: Response) => {
    const { user } = req.body;

    const token = await tokenService.createToken(user.email);

    return res.json(token);
  }),
);
