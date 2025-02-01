import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Interface do Mongoose para Product
export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  stock: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

// Cria o schema a partir da classe Product
export const ProductSchema = SchemaFactory.createForClass(Product);
