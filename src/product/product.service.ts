// src/product/product.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DeleteProductImageDto } from './dto/delete-product-image.dto';
import { Product } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(
    data: CreateProductDto,
    files: Express.Multer.File[],
  ): Promise<Product> {
    const category = await this.prisma.category.findUnique({
      where: { category_id: data.category_id },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    const product = await this.prisma.product.create({
      data: {
        name: data.name,
        SKU: data.SKU,
        description: data.description,
        price: data.price, // Now string
        original_price: data.original_price, // New field
        discounted_price: data.discounted_price, // New field
        promo_code: data.promo_code, // New field
        stock: data.stock, // Now string
        category_id: data.category_id,
        trending: data.trending,
        status: data.status,
      },
    });

    const uploadDir = './uploads/product';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    for (const file of files) {
      const fileExtension = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExtension}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, file.buffer);

      await this.prisma.productImage.create({
        data: {
          url: filePath,
          product_id: product.product_id,
        },
      });
    }

    return product;
  }

  async update(
    id: string,
    data: UpdateProductDto,
    files: Express.Multer.File[],
  ): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { product_id: id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const updatedProduct = await this.prisma.product.update({
      where: { product_id: id },
      data: {
        name: data.name ?? undefined,
        SKU: data.SKU ?? undefined,
        description: data.description ?? undefined,
        price: data.price ?? undefined,
        original_price: data.original_price ?? undefined, // New field
        discounted_price: data.discounted_price ?? undefined, // New field
        promo_code: data.promo_code ?? undefined, // New field
        stock: data.stock ?? undefined,
        category_id: data.category_id ?? undefined,
        trending: data.trending ?? undefined,
        status: data.status ?? undefined,
      },
    });

    if (files) {
      const uploadDir = './uploads/product';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      for (const file of files) {
        const fileExtension = path.extname(file.originalname);
        const fileName = `${uuidv4()}${fileExtension}`;
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, file.buffer);

        await this.prisma.productImage.create({
          data: {
            url: filePath,
            product_id: updatedProduct.product_id,
          },
        });
      }
    }

    return updatedProduct;
  }

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany({
      include: {
        images: true,
      },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { product_id: id },
      include: {
        images: true,
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  // async update(id: string, data: UpdateProductDto, files: Express.Multer.File[]): Promise<Product> {
  //   // Ensure the product exists
  //   const product = await this.prisma.product.findUnique({
  //     where: { product_id: id },
  //   });

  //   if (!product) {
  //     throw new NotFoundException('Product not found');
  //   }

  //   // Update the product
  //   const updatedProduct = await this.prisma.product.update({
  //     where: { product_id: id },
  //     data: {
  //       ...data,
  //     },
  //   });

  //   if (files) {
  //     // Save each image and create ProductImage records
  //     const uploadDir = './uploads/product';
  //     if (!fs.existsSync(uploadDir)) {
  //       fs.mkdirSync(uploadDir, { recursive: true });
  //     }

  //     for (const file of files) {
  //       const fileExtension = path.extname(file.originalname);
  //       const fileName = `${uuidv4()}${fileExtension}`;
  //       const filePath = path.join(uploadDir, fileName);
  //       fs.writeFileSync(filePath, file.buffer);

  //       await this.prisma.productImage.create({
  //         data: {
  //           url: filePath,
  //           product_id: updatedProduct.product_id,
  //         },
  //       });
  //     }
  //   }

  //   return updatedProduct;
  // }

  async remove(id: string): Promise<Product> {
    // Ensure the product exists
    const product = await this.prisma.product.findUnique({
      where: { product_id: id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Delete the product
    return this.prisma.product.delete({
      where: { product_id: id },
    });
  }

  async deleteProductImage(productId: string, productImageId: string) {
    try {
      // Check if the product exists
      const existingProduct = await this.prisma.product.findUnique({
        where: { product_id: productId },
        include: { images: true }, // Include related images
      });
      if (!existingProduct) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }

      // Find the product image to delete
      const productImageToDelete = existingProduct.images.find(
        (image) => image.image_id === productImageId,
      );
      if (!productImageToDelete) {
        throw new NotFoundException(
          `Product image with ID ${productImageId} not found`,
        );
      }

      // Delete the product image
      await this.prisma.productImage.delete({
        where: { image_id: productImageId },
      });

      return { message: `Deleted product image with ID ${productImageId}` };
    } catch (error) {
      throw error;
    }
  }

  async deleteProductImage1(
    id: string,
    deleteProductImageDto: DeleteProductImageDto,
  ) {
    const { image_id } = deleteProductImageDto;

    // Find the image record in the database
    const image = await this.prisma.productImage.findUnique({
      where: { image_id },
    });

    if (!image) {
      throw new NotFoundException(
        `Product image with ID ${image_id} not found`,
      );
    }

    // Delete the image record from the database
    await this.prisma.productImage.delete({
      where: { image_id },
    });

    // Delete the image file from the file system
    const imagePath = path.join(__dirname, '../../uploads', image.url);
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error(`Failed to delete image file: ${err.message}`);
      }
    });

    return { message: 'Product image deleted successfully' };
  }
}
