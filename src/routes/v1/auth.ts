import { Request, Response, NextFunction, Router } from 'express';

import * as userService from '../../services/user';
import * as tokenService from '../../services/token';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const email: string = req.body.email;
  const password: string = req.body.password;

  try {
    const user = await userService.createUser({ email, password });
    const token = await tokenService.createToken(user.email);
    const message = 'Successfully created user!';

    return res.status(201).send({
      message,
      user,
      token,
    });
  } catch (err) {
    return next(err);
  }
};

export const signin = async (req: Request, res: Response, next: NextFunction) => {
  const email: string = req.body.email;
  const password: string = req.body.password;

  try {
    const user = await userService.findUserByCredentials(email, password);
    const token = await tokenService.createToken(user.email);
    return res.status(200).send({ user, token });
  } catch (err) {
    return next(err);
  }
};

export const router = Router();
router.post('/signup', signup);
router.post('/signin', signin);
