import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserRole } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async createUser(
    username: string,
    password: string,
    role: UserRole = UserRole.USER,
  ): Promise<User> {
    // Hashear senha
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new this.userModel({
      username,
      password: hashedPassword,
      role,
    });
    return user.save();
  }


  async validatePassword(user: User, pass: string): Promise<boolean> {
    return bcrypt.compare(pass, user.password);
  }
}
