import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './produtos/produtos.module';
import { UsersModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';

// IMPORTS DO APP CONTROLLER/SERVICE
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest-crud'),
    ProductsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],   
  providers: [AppService],        
})
export class AppModule {}
