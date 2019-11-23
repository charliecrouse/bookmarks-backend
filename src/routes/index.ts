import { Router } from 'express';

import { router as v1 } from './v1';

export const router = Router();
router.use(v1);

router.get('/healthcheck', (req, res) => {
  res.status(200).send();
});
