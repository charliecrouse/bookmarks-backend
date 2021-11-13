import * as validator from 'validator';

import * as e from '../shared/errors';
import { findUserByEmail } from './user';
import { Bookmark, BookmarkShape } from '../models/bookmark';

export async function findBookmarkById(id: number): Promise<Bookmark> {
  const bookmark = await Bookmark.findByPk(id);

  if (!bookmark) {
    const message = `Failed to find Bookmark with id ${id}!`;
    return Promise.reject(new e.ClientError(message));
  }

  return bookmark;
}

export async function findOwnedBookmarks(ownerEmail: string): Promise<Bookmark[]> {
  const owner = await findUserByEmail(ownerEmail);

  const bookmarks = await Bookmark.findAll({
    where: { ownerEmail: owner.email },
  });

  return bookmarks;
}

export async function findOwnedBookmark(ownerEmail: string, id: number): Promise<Bookmark> {
  const owner = await findUserByEmail(ownerEmail);

  const bookmark = await Bookmark.findOne({
    where: {
      id,
      ownerEmail: owner.email,
    },
  });

  if (!bookmark) {
    const message = `Failed to find Bookmark with id ${id}!`;
    return Promise.reject(new e.ClientError(message));
  }

  return bookmark;
}

interface CreateOwnedBookmarkProps extends BookmarkShape {
  ownerEmail: string;
  parentId: number | null;
}

export async function createOwnedBookmark(props: CreateOwnedBookmarkProps): Promise<Bookmark> {
  const { ownerEmail, parentId, url } = props;

  const owner = await findUserByEmail(ownerEmail);

  if (parentId != null) {
    // Parent Bookmark must exist
    const parent = await findOwnedBookmark(owner.email, parentId);

    // Parent Bookmark must be a folder
    if (!parent.isFolder) {
      const message = `The given parentId, ${parentId}, is not a folder!`;
      return Promise.reject(new e.ClientError(message));
    }
  }

  // URL must be valid
  if (url && !validator.isURL(url)) {
    const message = `The given URL, "${url}", is not recognized as a valid URL!`;
    return Promise.reject(new e.ClientError(message));
  }

  // const bookmark = new Bookmark(props);
  const bookmark = new Bookmark(props);
  return await bookmark.save();
}

interface UpdateOwnedBookmarkProps {
  name?: string;
  url?: string;
  parentId?: number;
}

interface UpdateOwnedBookmarkResponse {
  bookmark: Bookmark;
  issues: string[];
}

export async function updateOwnedBookmark(
  ownerEmail: string,
  id: number,
  updates: UpdateOwnedBookmarkProps,
): Promise<UpdateOwnedBookmarkResponse> {
  const { name, url, parentId } = updates;
  const bookmark = await findOwnedBookmark(ownerEmail, id);

  const issues: string[] = [];

  if (name) {
    bookmark.name = name;
  }

  if (url) {
    if (bookmark.isFolder) {
      issues.push(`Cannot update the URL for ${id} because it is a folder!`);
    } else if (!validator.isURL(url)) {
      issues.push(`The given URL, "${url}" is invalid!`);
    } else {
      bookmark.url = url;
    }
  }

  if (parentId != null) {
    const parent = await findOwnedBookmark(ownerEmail, parentId);

    if (!parent.isFolder) {
      issues.push(`The given parentId, ${parentId}, is not a Folder!`);
    } else if (parentId === bookmark.id) {
      issues.push(`Cannot make a Bookmark it's own Parent!`);
    } else if (await parent.isChildOf(bookmark.id)) {
      issues.push(`Cannot make a Bookmark a child of one of it's children!`);
    } else {
      bookmark.parent = parentId;
    }
  }

  return {
    bookmark: await bookmark.save(),
    issues,
  };
}

export async function deleteOwnedBookmark(ownerEmail: string, id: number): Promise<void> {
  const bookmark = await findOwnedBookmark(ownerEmail, id);

  if (bookmark.isBookmark) {
    return await bookmark.destroy();
  }

  const children = await Bookmark.findAll({
    where: {
      ownerEmail,
      parent: bookmark.id,
    },
  });

  const recursivelyDeleteAllChildren = children.map(child => {
    return deleteOwnedBookmark(ownerEmail, child.id);
  });

  await Promise.all(recursivelyDeleteAllChildren);
  await bookmark.destroy();
}
