import { Index, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from './user';

interface SessionShape {
  jwt: string;
  ownerEmail: string;
}

export interface JWTShape {
  role: string;
  expires: Date;
}

@Table({ timestamps: false, tableName: 'sessions' })
export class Session extends Model<Session, SessionShape> implements SessionShape {
  // --------------------
  // Columns
  // --------------------
  @Column({ primaryKey: true })
  jwt!: string;

  // --------------------
  // Relations
  // -------------------
  @Index
  @Column
  @ForeignKey(() => User)
  ownerEmail!: string;
}
