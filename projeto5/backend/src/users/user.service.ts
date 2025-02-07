import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserRole } from './schemas/user.schema';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async onModuleInit() {
    // Verifica e cria o usuário "usuario" (role padrão: user)
    const user = await this.findByUsername('usuario');
    if (!user) {
      await this.createUser('usuario', '123', UserRole.USER);
      console.log("Usuário 'usuario' criado com sucesso.");
    }

    // Verifica e cria o usuário "admin" com role ADMIN
    const admin = await this.findByUsername('admin');
    if (!admin) {
      await this.createUser('admin', '123', UserRole.ADMIN);
      console.log("Usuário 'admin' criado com sucesso.");
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async createUser(
    username: string,
    password: string,
    role: UserRole = UserRole.USER,
  ): Promise<User> {
    // Gera o hash da senha
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
