import { Router } from 'express';

import { findUserByCredentials } from '@controllers/user';
import { createToken, findTokenByJWT } from '@controllers/token';
import { wrapAsync } from '@rest/middleware/async';

export const tokens = Router();

tokens.post(
  '/',
  wrapAsync(async (req, res) => {
    const user = await findUserByCredentials(req.body.email, req.body.password);
    const token = await createToken(user.email);
    res.status(201).json({ token });
  }),
);

tokens.post(
  '/:jwt',
  wrapAsync(async (req, res) => {
    const existingToken = await findTokenByJWT(req.params['jwt']);
    const token = await createToken(existingToken.ownerEmail);
    res.status(201).json({ token });
  }),
);
