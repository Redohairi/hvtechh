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
    UseGuards,
  } from '@nestjs/common';
  import { ProductsService } from './produtos.services';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  import { UserRole } from '../users/schemas/user.schema';
  

  
  @Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard) // ex.: todos métodos precisam do JWT e Roles
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Roles(UserRole.USER, UserRole.ADMIN)
  findAll() {
    // ... Qualquer usuário logado
    return this.productsService.findAll();
  }
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @Roles(UserRole.ADMIN) // apenas admin
  create(@Body() dto: any) {
    return this.productsService.create(dto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: any) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}