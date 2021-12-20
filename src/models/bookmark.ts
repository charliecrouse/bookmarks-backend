import { STRING, NUMBER } from 'sequelize';
import { Table, Model, Column, ForeignKey, Index } from 'sequelize-typescript';
import { User } from '@models/user';

@Table({ timestamps: true, tableName: 'bookmarks' })
export class Bookmark extends Model<BookmarkProps, BookmarkCreationProps> {
  // --------------------
  // Columns
  // --------------------
  @Column
  name!: string;

  @Column({ allowNull: true, type: STRING })
  url!: Maybe<string>;

  // --------------------
  // Relations
  // --------------------
  @ForeignKey(() => Bookmark)
  @Column({ allowNull: true, type: NUMBER })
  parentId!: Maybe<number>;

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
}
