import { Router } from 'express';

import { findOwnedBookmarks, createOwnedBookmark } from '@controllers/bookmark';
import { wrapAsync } from '@rest/middleware/async';
import { wrapAuth } from '@rest/middleware/auth';

export const bookmarksRouter = Router();
bookmarksRouter.use(wrapAsync(wrapAuth));

bookmarksRouter.get(
  '/',
  wrapAsync(async (req, res) => {
    const user = (req as AuthenticatedRequest).body.user;
    const bookmarks = await findOwnedBookmarks(user.email);
    res.status(200).json(bookmarks);
  }),
);

bookmarksRouter.post(
  '/',
  wrapAsync(async (req, res) => {
    const { user } = (req as AuthenticatedRequest).body;

    const props: BookmarkCreationProps = {
      ownerEmail: user.email,
      name: req.body.name,
      url: req.body.url,
      parentId: req.body.parentId,
    };

    const bookmark = await createOwnedBookmark(props);
    res.status(201).json(bookmark.toJSON());
  }),
);
