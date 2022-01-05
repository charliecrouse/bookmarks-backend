import { Router } from 'express';

import { UserProps } from '@models/user';
import { createUser } from '@controllers/user';
import { wrapAsync } from '@rest/middleware/async';

export const usersRouter = Router();

usersRouter.post(
  '/',
  wrapAsync(async (req, res) => {
    const user: Partial<UserProps> = await createUser(req.body);
    delete user.password;

    res.status(201).send(user);
  }),
);
