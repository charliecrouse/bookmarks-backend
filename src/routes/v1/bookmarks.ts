import { NextFunction, Response, Request, Router } from 'express';

import * as bookmarkService from '../../services/bookmark';

import { authMiddleware } from '../../middleware/auth';
import { User } from '../../models/user';

export const getBookmarks = async (req: Request, res: Response, next: NextFunction) => {
  const user: User = req.body.user;

  try {
    const bookmarks = await bookmarkService.findOwnedBookmarks(user.email);
    return res.status(200).json({
      message: 'Successfully fetched bookmarks!',
      bookmarks,
    });
  } catch (err) {
    return next(err);
  }
};

export const createBookmark = async (req: Request, res: Response, next: NextFunction) => {
  const name: string = req.body.name;
  const url: string | null = req.body.url || null;
  const parentId: number | null = req.body.parentId ?? null;

  const user: User = req.body.user;

  try {
    const bookmark = await bookmarkService.createBookmark(user.email, parentId, { name, url });
    return res.status(201).json({
      message: 'Successfully created new bookmark!',
      bookmark,
    });
  } catch (err) {
    return next(err);
  }
};

export const getBookmark = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.body.user;

  try {
    const id = parseInt(req.params.id);
    const bookmark = await bookmarkService.findOwnedBookmark(id, user.email);

    return res.status(200).json({
      message: 'Successfully fetched bookmark!',
      bookmark,
    });
  } catch (err) {
    return next(err);
  }
};

export const updateBookmark = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.body.user;

  try {
    const id = parseInt(req.params.id);
    const bookmark = await bookmarkService.updateBookmark(id, user.email, req.body);

    return res.status(202).json({
      message: 'Successfully updated bookmark!',
      bookmark,
    });
  } catch (err) {
    return next(err);
  }
};

export const deleteBookmark = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.body.user;

  try {
    const id = parseInt(req.params.id);
    const ids = await bookmarkService.deleteOwnedBookmarkAndChildren(id, user.email);

    return res.status(204).json({
      message: 'Successfully deleted bookmarks!',
      ids,
    });
  } catch (err) {
    return next(err);
  }
};

export const router = Router();

router.use(authMiddleware());
router.get('/', getBookmarks);
router.post('/', createBookmark);
router.get('/:id', getBookmark);
router.patch('/:id', updateBookmark);
router.delete('/:id', deleteBookmark);
