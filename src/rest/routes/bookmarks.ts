import { Router } from 'express';

import { findOwnedBookmarks, findOwnedBookmarkById, createOwnedBookmark } from '@controllers/bookmark';
import { wrapAsync } from '@rest/middleware/async';
import { wrapAuth } from '@rest/middleware/auth';
import { BookmarkCreationProps } from '@models/bookmark';

export const bookmarksRouter = Router();
bookmarksRouter.use(wrapAsync(wrapAuth));

bookmarksRouter.get(
  '/',
  wrapAsync(async (req, res) => {
    const { user } = req.body;
    const bookmarks = await findOwnedBookmarks(user.email);
    res.status(200).json(bookmarks);
  }),
);

bookmarksRouter.post(
  '/',
  wrapAsync(async (req, res) => {
    const payload: BookmarkCreationProps = {
      ownerEmail: req.body?.user?.email || '',
      name: req.body.name || '',
      url: undefined,
      parentId: undefined,
    }

    if (req.body.url) {
      payload.url = req.body.url;
    }

    if (req.body.parentId) {
      payload.parentId = req.body.parentId.toString();
    }

    const bookmark = await createOwnedBookmark(payload);
    res.status(201).json(bookmark);
  }),
);

bookmarksRouter.get('/:id', wrapAsync(async (req, res) => {
  const bookmark = await findOwnedBookmarkById(req.body?.user?.email, req.params['id']);
  res.status(200).json(bookmark);
}));
