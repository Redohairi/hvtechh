import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    HttpStatus,
    HttpCode,
  } from '@nestjs/common';
  import { ProductsService } from './produtos.services';
  import { CreateProductDto } from './dto/create-produtos.dto';
  import { UpdateProductDto } from './dto/update-produtos.dto';
  import {Product} from './schema/produtos.schema';
  
  @Controller('products')
  export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createProductDto: CreateProductDto): Promise<Product> {
      return this.productsService.create(createProductDto);
    }
  
    @Get()
    findAll(): Promise<Product[]> {
      return this.productsService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string): Promise<Product> {
      return this.productsService.findOne(id);
    }
  
    @Put(':id')
    update(
      @Param('id') id: string,
      @Body() updateProductDto: UpdateProductDto,
    ): Promise<Product> {
      return this.productsService.update(id, updateProductDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string): Promise<Product> {
      return this.productsService.remove(id);
    }
  }
  