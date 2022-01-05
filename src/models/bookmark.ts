import { Db } from 'mongodb';
import { schema, types } from 'papr';

import { papr } from '@modules/database/papr';

const bookmarkSchema = schema(
  {
    // --------------------
    // Properties
    // --------------------
    name: types.string({ required: true }),
    url: types.string(),

    // --------------------
    // Relations
    // --------------------
    parentId: types.objectId(),
    ownerEmail: types.string({ required: true }),
  },
  { timestamps: true },
);

export const Bookmark = papr.model('bookmarks', bookmarkSchema);

export type BookmarkProps = typeof bookmarkSchema[0];
export type BookmarkCreationProps = Optional<BookmarkProps, MongoGeneratedProps>;

export const createBookmarkIndexes = async (db: Db) => {
  await db.createIndex('bookmarks', { ownerEmail: 1, parentId: 1 });
};
