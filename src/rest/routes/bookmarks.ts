import { Router } from 'express';

import {
  findOwnedBookmarks,
  findOwnedBookmarkById,
  createOwnedBookmark,
} from '@controllers/bookmark';
import { wrapAsync } from '@rest/middleware/async';
import { wrapAuth } from '@rest/middleware/auth';

export const bookmarksRouter = Router();
bookmarksRouter.use(wrapAsync(wrapAuth));

bookmarksRouter.get(
  '/',
  wrapAsync(async (req, res) => {
    const bookmarks = await findOwnedBookmarks(req.body.ownerEmail);
    res.status(200).json(bookmarks);
  }),
);

bookmarksRouter.post(
  '/',
  wrapAsync(async (req, res) => {
    const bookmark = await createOwnedBookmark(req.body);
    res.status(201).json(bookmark);
  }),
);

bookmarksRouter.get(
  '/:bookmarkId',
  wrapAsync(async (req, res) => {
    const bookmark = await findOwnedBookmarkById(req.body?.ownerEmail, req.params['bookmarkId']);
    res.status(200).json(bookmark);
  }),
);
