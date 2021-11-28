import { Table, Column, Model, HasMany } from 'sequelize-typescript';

import { Token } from './token';
import { Bookmark } from './bookmark';

export interface UserShape {
  email: string;
  password: string;
}

@Table({ timestamps: true })
export class User extends Model<User, UserShape> implements UserShape {
  // --------------------------------------------
  // COLUMNS
  // --------------------------------------------
  @Column({ primaryKey: true })
  email!: string;

  @Column
  password!: string;

  // --------------------------------------------
  // DERIVED FIELDS
  // --------------------------------------------
  @HasMany(() => Token)
  tokens!: Token[];

  @HasMany(() => Bookmark)
  bookmarks!: Bookmark[];
}
