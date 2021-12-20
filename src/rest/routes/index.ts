import { Router } from 'express';

import { users } from '@rest/routes/users';
import { tokens } from '@rest/routes/tokens';

export const router = Router();
router.use('/users', users);
router.use('/tokens', tokens);

router.get('/healthcheck', (_req, res) => {
  res.status(200).send();
});

router.get('*', (_req, res) => {
  res.status(401).send();
});
