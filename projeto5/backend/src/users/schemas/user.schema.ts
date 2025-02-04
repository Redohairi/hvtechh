import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string; // será armazenada hash (bcrypt)

  @Prop({ enum: UserRole, default: UserRole.USER })
  role: UserRole; // 'admin' ou 'user'
}

export const UserSchema = SchemaFactory.createForClass(User);
