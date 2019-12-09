import * as validator from 'validator';

import * as userService from '../services/user';
import * as errors from '../utils/errors';

import { Bookmark, BookmarkShape } from '../models/bookmark';

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

export const createOwnedBookmark = async (
  ownerEmail: string,
  parent: number | null,
  props: BookmarkShape,
): Promise<Bookmark> => {
  const user = await userService.findUserByEmail(ownerEmail);

  if (parent) {
    const parentBookmark = await findOwnedBookmark(parent, user.email);

    if (!parentBookmark.isFolder) {
      const error = new errors.ClientError(
        `The bookmark with the given id, ${parent}, is not a folder!`,
        400,
      );
      return Promise.reject(error);
    }
  }

  if (props.url && !validator.isURL(props.url)) {
    const error = new errors.ClientError(`The given URL, ${props.url}, is invalid!`, 400);
    return Promise.reject(error);
  }

  const bookmark = new Bookmark({
    ...props,
    parent,
    ownerEmail: user.email,
  });

  return await bookmark.save();
};

export const updateOwnedBookmark = async (
  id: number,
  ownerEmail: string,
  props: Partial<Bookmark>,
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
    if (!validator.isURL(props.url)) {
      const error = new errors.ClientError(`The given URL, ${props.url}, is invalid!`, 400);
      return Promise.reject(error);
    }
    bookmark.url = props.url;
  }

  if (props.parent) {
    const parentBookmark = await findOwnedBookmark(props.parent, ownerEmail);

    if (!parentBookmark.isFolder) {
      const error = new errors.ClientError(
        `The bookmark with the given id, ${props.parent}, is not a folder!`,
        400,
      );
      return Promise.reject(error);
    }
  }

  return await bookmark.save();
};

// If the given bookmark is a folder, this function will recursively delete all children bookmarks
// and sub-folders.
export const deleteOwnedBookmark = async (id: number, ownerEmail: string): Promise<void> => {
  const bookmark = await findOwnedBookmark(id, ownerEmail);

  if (bookmark.isBookmark) {
    return await bookmark.destroy();
  }

  // Delete all children of the current bookmark, if it is a folder
  const children = await Bookmark.findAll({
    where: {
      parent: bookmark.id,
      ownerEmail: ownerEmail,
    },
  });

  const promises = children.map(child => deleteOwnedBookmark(child.id, ownerEmail));
  await Promise.all(promises);

  return await bookmark.destroy();
};
