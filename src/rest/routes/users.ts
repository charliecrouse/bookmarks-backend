import { Router } from 'express';

import { createUser } from '@controllers/user';
import { wrapAsync } from '@rest/middleware/async';

export const usersRouter = Router();

usersRouter.post(
  '/',
  wrapAsync(async (req, res) => {
    const user = await createUser(req.body);

    const result: Partial<UserProps> = user.toJSON();
    delete result.password;

    res.status(201).send(result);
  }),
);
