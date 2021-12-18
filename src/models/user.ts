import { Table, Column, Model } from 'sequelize-typescript';

interface UserShape {
  email: string;
  password: string;
}

@Table({ timestamps: true, tableName: 'users' })
export class User extends Model<User, UserShape> implements UserShape {
  // --------------------
  // Columns
  // --------------------
  @Column({ primaryKey: true })
  email!: string;

  @Column
  password!: string;

  // --------------------
  // RELATIONS
  // --------------------
}
