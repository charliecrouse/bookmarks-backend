import { Router, Request, Response } from 'express';

import * as bookmarkService from '../services/bookmark';
import { asyncMiddleware, authMiddleware } from '../server/middleware';

export const router = Router();
router.use(asyncMiddleware(authMiddleware));

router.post(
  '/',
  asyncMiddleware(async (req: Request, res: Response) => {
    const { user } = req.body;
    const bookmark = await bookmarkService.createOwnedBookmark({
      ownerEmail: user.email,
      ...req.body,
    });

    return res.status(201).json(bookmark);
  }),
);

router.get(
  '/',
  asyncMiddleware(async (req: Request, res: Response) => {
    const { user } = req.body;
    const bookmarks = await bookmarkService.findOwnedBookmarks(user.email);

    return res.json(bookmarks);
  }),
);

router.get(
  '/:id',
  asyncMiddleware(async (req: Request, res: Response) => {
    const { user } = req.body;
    const bookmark = await bookmarkService.findOwnedBookmark(user.email, +req.params.id);

    res.json(bookmark);
  }),
);

router.patch(
  '/:id',
  asyncMiddleware(async (req: Request, res: Response) => {
    const { user } = req.body;
    const bookmark = await bookmarkService.updateOwnedBookmark(
      user.email,
      +req.params.id,
      req.body,
    );

    res.json(bookmark);
  }),
);

router.delete(
  '/:id',
  asyncMiddleware(async (req: Request, res: Response) => {
    const { user } = req.body;
    await bookmarkService.deleteOwnedBookmark(user.email, +req.params.id);
    return res.status(204).send();
  }),
);
