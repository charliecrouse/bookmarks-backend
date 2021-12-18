import { Table, Model, Column, ForeignKey, Index } from "sequelize-typescript";
import { User } from './user';

interface BookmarkShape {
  name: string;
  url: string;
}

@Table({ timestamps: true, tableName: 'bookmarks' })
export class Bookmark extends Model<Bookmark, BookmarkShape> implements BookmarkShape {
  // --------------------
  // Columns
  // --------------------
  @Column
  name!: string;

  @Column({ allowNull: true })
  url!: string;

  // --------------------
  // Relations
  // --------------------
  @ForeignKey(() => Bookmark)
  @Column({ allowNull: true })
  parent?: number;

  @Index
  @ForeignKey(() => User)
  @Column
  ownerEmail!: string;

  // -------------------
  // Helpers
  // -------------------
  get isBookmark(): boolean {
    return !!this.url;
  }

  get isFolder(): boolean {
    return !this.isBookmark;
  }
};
