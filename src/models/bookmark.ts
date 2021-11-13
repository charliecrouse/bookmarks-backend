import { Optional } from 'sequelize';
import { Model, Table, Column, ForeignKey, HasMany } from 'sequelize-typescript';

import { User } from './user';

export interface BookmarkShape {
  name: string;
  url: string;
}

@Table({ timestamps: true })
export class Bookmark extends Model<Bookmark, Optional<BookmarkShape, 'url'>>
  implements BookmarkShape {
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

  get isChild(): boolean {
    return this.parent !== null;
  }

  /* Determine if the current Bookmark instance is a child of the Bookmark with the given id */
  async isChildOf(targetId: number): Promise<boolean> {
    return await this._isChildOf(targetId, this.parent);
  }

  async _isChildOf(targetId: number, parentId?: number): Promise<boolean> {
    if (parentId == null) return false;

    const parent = await Bookmark.findByPk(parentId);

    if (!parent) return false;
    if (parent.id === targetId) return true;

    return await this._isChildOf(targetId, this.parent);
  }
}
