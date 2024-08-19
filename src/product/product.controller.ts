// src/product/product.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DeleteProductImageDto } from './dto/delete-product-image.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 10 }])
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] }
  ) {
    return this.productService.create(createProductDto, files?.images);
  }

  
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 10 }])
  )
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] }
  ) {
    return this.productService.update(id, updateProductDto, files?.images);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @Delete(':productId/images/:productImageId')
  async deleteProductImage(
    @Param('productId') productId: string,
    @Param('productImageId') productImageId: string,
  ) {
    return this.productService.deleteProductImage(productId, productImageId);
  }

  @Delete('images/:id')
  async deleteProductImage1(
    @Param('id') id: string,
    @Body() deleteProductImageDto: DeleteProductImageDto,
  ) {
    return this.productService.deleteProductImage1(id, deleteProductImageDto);
  }
}



// OLD CODE WITHOUT MULTER OPTION

// // src/product/product.controller.ts
// import {
//   Controller,
//   Post,
//   Body,
//   UploadedFiles,
//   UseInterceptors,
// } from '@nestjs/common';
// import { FileFieldsInterceptor } from '@nestjs/platform-express';
// import { CreateProductDto } from './dto/create-product.dto';
// import { ProductService } from './product.service';

// @Controller('product')
// export class ProductController {
//   constructor(private readonly productService: ProductService) {}

//   @Post()
//   @UseInterceptors(
//     FileFieldsInterceptor([{ name: 'images', maxCount: 10 }])
//   )
//   async create(
//     @Body() createProductDto: CreateProductDto,
//     @UploadedFiles() files: { images?: Express.Multer.File[] }
//   ) {
//     return this.productService.create(createProductDto, files?.images);
//   }
// }