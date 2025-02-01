import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './produtos.services'
import { ProductsController } from './produtos.controller';
import {Product, ProductSchema} from './schema/produtos.schema';

@Module({
  imports: [
    // Vinculamos o schema Product ao módulo de Mongoose
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
