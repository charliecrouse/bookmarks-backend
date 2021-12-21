import { Table, Column, Model } from 'sequelize-typescript';

@Table({ timestamps: true, tableName: 'users' })
export class User extends Model<UserProps, UserCreationProps> implements UserProps {
  // --------------------
  // Columns
  // --------------------
  @Column({ primaryKey: true })
  email!: string;

  @Column
  password!: string;
}
