import * as jwt from 'jsonwebtoken';

import { Model, Column, Table, ForeignKey } from 'sequelize-typescript';

import { User } from './user';

export interface TokenShape {
  jwt: string;
  ownerEmail: string;
}

export interface JWTShape {
  role: string;
  expires: Date;
}

@Table({ timestamps: false })
export class Token extends Model<Token, TokenShape> implements TokenShape {
  @Column({ primaryKey: true })
  jwt!: string;

  @ForeignKey(() => User)
  ownerEmail!: string;

  static getSecret(): string {
    return process.env.JWT_SECRET || 'secret';
  }

  get decoded(): JWTShape {
    return jwt.verify(this.jwt, Token.getSecret()) as JWTShape;
  }

  get role(): string {
    return this.decoded.role;
  }

  get expires(): Date {
    return this.decoded.expires;
  }

  get isExpired(): boolean {
    return this.expires <= new Date();
  }
}
