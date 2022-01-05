import { Router } from 'express';

import { usersRouter } from '@rest/routes/users';
import { tokensRouter } from '@rest/routes/tokens';
import { bookmarksRouter } from '@rest/routes/bookmarks';

export const router = Router();
router.use('/users', usersRouter);
router.use('/tokens', tokensRouter);
router.use('/bookmarks', bookmarksRouter);

router.get('/healthcheck', (_req, res) => {
  res.status(200).send();
});

router.get('*', (_req, res) => {
  res.status(401).send();
});
