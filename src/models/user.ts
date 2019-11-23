import { Table, Column, Model, HasMany } from 'sequelize-typescript';

import { Token } from './token';

export interface UserShape {
  email: string;
  password: string;
}

@Table({ timestamps: true })
export class User extends Model<User> implements UserShape {
  @Column({ primaryKey: true })
  email!: string;

  @Column
  password!: string;

  @HasMany(() => Token)
  tokens!: Token[];
}
