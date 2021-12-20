import config from 'config';
import { JwtPayload, verify } from 'jsonwebtoken';
import { Table, Model, Column, ForeignKey, Index } from 'sequelize-typescript';

import { User } from '@models/user';

@Table({ timestamps: false, tableName: 'tokens' })
export class Token extends Model<TokenShape, TokenCreationProps> {
  // --------------------
  // Columns
  // --------------------
  @Column({ primaryKey: true })
  jwt!: string;

  // --------------------
  // Relations
  // --------------------
  @Index
  @Column
  @ForeignKey(() => User)
  ownerEmail!: string;

  // --------------------
  // Helpers
  // --------------------
  static get secret(): string {
    return config.get<string>('jwt.secret');
  }

  get decoded(): JwtPayload {
    return verify(this.jwt, Token.secret) as JwtPayload;
  }

  get role(): string {
    return this.decoded['role'] || 'user';
  }

  get exp(): Date {
    const { exp } = this.decoded;

    if (!exp) return new Date();
    return new Date(exp);
  }

  get isExpired(): boolean {
    return this.exp <= new Date();
  }
}
