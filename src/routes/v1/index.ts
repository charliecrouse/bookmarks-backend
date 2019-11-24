import { Router } from 'express';

import { router as auth } from './auth';
import { router as bookmarks } from './bookmarks';

export const router = Router();
router.use(auth);
router.use('/bookmarks', bookmarks);
