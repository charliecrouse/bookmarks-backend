import { Model, Table, Column, ForeignKey, HasMany } from 'sequelize-typescript';

import { User } from './user';

export interface BookmarkShape {
  name: string;
  url: string | null;
}

@Table({ timestamps: true })
export class Bookmark extends Model<Bookmark> implements BookmarkShape {
  // --------------------------------------------
  // COLUMNS
  // --------------------------------------------
  @Column
  name!: string;

  @Column({ allowNull: true })
  url!: string;

  // --------------------------------------------
  // RELATIONS
  // --------------------------------------------
  @ForeignKey(() => Bookmark)
  parent?: number;

  @ForeignKey(() => User)
  ownerEmail!: string;

  // --------------------------------------------
  // DERIVED FIELDS
  // --------------------------------------------
  @HasMany(() => Bookmark, { foreignKey: { allowNull: true } })
  bookmarks?: Bookmark[];

  get isBookmark(): boolean {
    return !!this.url;
  }

  get isFolder(): boolean {
    return !this.isBookmark;
  }
}
