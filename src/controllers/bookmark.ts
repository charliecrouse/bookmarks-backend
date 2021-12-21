import * as e from '@utils/error';
import { Bookmark } from '@models/bookmark';
import { findUserByEmail } from '@controllers/user';
import { bookmarkCreationSchema } from '@validators/bookmark';

export const findOwnedBookmarks = async (ownerEmail: string): Promise<Bookmark[]> => {
  // Verify that a User exists with the given email
  await findUserByEmail(ownerEmail);

  return Bookmark.findAll({
    where: { ownerEmail },
  });
};

export const findOwnedBookmarkById = async (id: number, ownerEmail: string): Promise<Bookmark> => {
  // Verify that a User exists with the given email
  await findUserByEmail(ownerEmail);

  const bookmark = await Bookmark.findOne({
    where: {
      id,
      ownerEmail,
    },
    raw: true,
  });

  if (!bookmark) {
    const message = `Failed to find Bookmark with id, "${id}" and owner "${ownerEmail}"`;
    return Promise.reject(new e.ClientError(message, 401));
  }

  return bookmark;
};

export const createOwnedBookmark = async (props: BookmarkCreationProps): Promise<Bookmark> => {
  const { error } = bookmarkCreationSchema.validate(props);

  if (error) {
    const message = `Failed to create Bookmark, ${error.message}`;
    return Promise.reject(new e.ValidationError(message));
  }

  // Verify that a User exists with the given email
  await findUserByEmail(props.ownerEmail);

  const parentIsValid = await validateParentId(props.parentId, props.ownerEmail);

  if (!parentIsValid) {
    const message = `Failed to create Bookmark because the given parentId, ${props.parentId}, is invalid`;
    return Promise.reject(new e.ClientError(message));
  }

  const bookmark = new Bookmark(props);
  return bookmark.save();
};

const validateParentId = async (parentId: Maybe<number>, ownerEmail: string): Promise<boolean> => {
  if (parentId == undefined) return true;

  const parent = await findOwnedBookmarkById(parentId, ownerEmail);
  return parent.isFolder;
};
