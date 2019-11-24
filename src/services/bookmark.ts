import * as userService from '../services/user';
import * as errors from '../utils/errors';

import { Bookmark, BookmarkShape } from '../models/bookmark';

export const createBookmark = async (
  ownerEmail: string,
  parentId: number | null,
  props: BookmarkShape,
): Promise<Bookmark> => {
  const user = await userService.findUserByEmail(ownerEmail);

  const parent = parentId !== null ? await findOwnedBookmark(parentId, user.email) : null;

  if (parent && !parent.isFolder) {
    const error = new errors.ClientError(
      `The bookmark with the given id, ${parentId}, is not a folder!`,
      400,
    );
    return Promise.reject(error);
  }

  const bookmark = new Bookmark({
    ...props,
    parent: parent ? parent.id : null,
    ownerEmail: user.email,
  });

  return await bookmark.save();
};

export const findBookmarkById = async (id: number): Promise<Bookmark> => {
  const bookmark = await Bookmark.findByPk(id);

  if (!bookmark) {
    const error = new errors.ClientError(`No bookmark exists with the given id, ${id}!`, 400);
    return Promise.reject(error);
  }

  return bookmark;
};

export const findOwnedBookmarks = async (ownerEmail: string): Promise<Bookmark[]> => {
  const owner = await userService.findUserByEmail(ownerEmail);

  const bookmarks = await Bookmark.findAll({
    where: {
      ownerEmail: owner.email,
    },
  });

  return bookmarks;
};

export const findOwnedBookmark = async (id: number, ownerEmail: string): Promise<Bookmark> => {
  const user = await userService.findUserByEmail(ownerEmail);
  const bookmark = await findBookmarkById(id);

  if (bookmark.ownerEmail !== user.email) {
    const error = new errors.ClientError(`You have no bookmarks with id, ${id}!`, 400);
    return Promise.reject(error);
  }

  return bookmark;
};

export const updateBookmark = async (
  id: number,
  ownerEmail: string,
  props: { name?: string; url?: string; parentId?: number },
): Promise<Bookmark> => {
  const bookmark = await findOwnedBookmark(id, ownerEmail);

  if (props.url && bookmark.isFolder) {
    const error = new errors.ClientError(`Cannot add url to folder bookmark!`, 400);
    return Promise.reject(error);
  }

  if (props.name) {
    bookmark.name = props.name;
  }

  if (bookmark.isBookmark && props.url) {
    bookmark.url = props.url;
  }

  if (props.parentId) {
    const parent = await findOwnedBookmark(props.parentId, ownerEmail);

    if (!parent.isFolder) {
      const error = new errors.ClientError(
        `The bookmark with the given id, ${props.parentId}, is not a folder!`,
        400,
      );
      return Promise.reject(error);
    }
  }

  await bookmark.save();
  return bookmark;
};

export const deleteOwnedBookmarkAndChildren = async (
  id: number,
  ownerEmail: string,
): Promise<number[]> => {
  const bookmark = await findOwnedBookmark(id, ownerEmail);

  const children = await Bookmark.findAll({
    where: {
      parent: bookmark.id,
      ownerEmail: ownerEmail,
    },
  });

  const ids = children.map(child => child.id);
  const promises = children.map(child => child.destroy());

  ids.push(bookmark.id);

  await Promise.all(promises);
  await bookmark.destroy();

  return ids;
};
