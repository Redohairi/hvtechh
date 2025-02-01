import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './produtos/produtos.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest-crud'), // Ajuste a string de conexão
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
