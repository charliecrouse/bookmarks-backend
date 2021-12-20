import { Table, Column, Model } from 'sequelize-typescript';

@Table({ timestamps: true, tableName: 'users' })
export class User extends Model<UserShape, UserCreationProps> implements UserShape {
  // --------------------
  // Columns
  // --------------------
  @Column({ primaryKey: true })
  email!: string;

  @Column
  password!: string;
}
