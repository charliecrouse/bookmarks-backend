import { ObjectId } from 'mongodb';

import * as e from '@utils/error';
import { Bookmark, BookmarkProps, BookmarkCreationProps } from '@models/bookmark';
import { findUserByEmail } from '@controllers/user';
import { bookmarkCreationSchema } from '@validators/bookmark';

export const findOwnedBookmarks = async (ownerEmail: string): Promise<BookmarkProps[]> => {
  // Verify that a User exists with the given email
  await findUserByEmail(ownerEmail);

  return Bookmark.find({ ownerEmail });
};

export const findOwnedBookmarkById = async (
  _id: string,
  ownerEmail: string,
): Promise<BookmarkProps> => {
  // Verify that a User exists with the given email
  await findUserByEmail(ownerEmail);

  const bookmark = await Bookmark.findOne({
    ownerEmail,
    _id: new ObjectId(_id),
  });

  if (!bookmark) {
    const message = `Failed to find Bookmark with id, "${_id}" and owner "${ownerEmail}"`;
    return Promise.reject(new e.ClientError(message, 401));
  }

  return bookmark;
};

export const createOwnedBookmark = async (props: BookmarkCreationProps): Promise<BookmarkProps> => {
  const { error } = bookmarkCreationSchema.validate(props);

  if (error) {
    const message = `Failed to create Bookmark, ${error.message}`;
    return Promise.reject(new e.ValidationError(message));
  }

  // Verify that a User exists with the given email
  await findUserByEmail(props.ownerEmail);

  const payload: BookmarkCreationProps = {
    name: props.name,
    url: props.url,
    parentId: props.parentId ? new ObjectId(props.parentId) : undefined,
    ownerEmail: props.ownerEmail,
  };

  const parentIsValid = await validateParentId(payload.parentId, payload.ownerEmail);

  if (!parentIsValid) {
    const message = `Failed to create Bookmark because the given parentId, ${payload.parentId}, is invalid`;
    return Promise.reject(new e.ClientError(message));
  }

  return Bookmark.insertOne(payload);
};

const validateParentId = async (
  parentId: Maybe<ObjectId>,
  ownerEmail: string,
): Promise<boolean> => {
  if (parentId == undefined) return true;

  const parent = await findOwnedBookmarkById(parentId.toString(), ownerEmail);
  return isFolder(parent);
};

const isBookmark = (bookmark: BookmarkProps): boolean => {
  return !!bookmark.url;
};

const isFolder = (bookmark: BookmarkProps): boolean => {
  return !isBookmark(bookmark);
};
