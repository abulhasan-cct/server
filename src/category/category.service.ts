import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Category } from '@prisma/client';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';


@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCategoryDto, file: Express.Multer.File): Promise<Category> {
    const image = file ? `uploads/category/${file.filename}` : null;
    return this.prisma.category.create({
      data: { ...data, image },
    });
  }

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }

  async findOne(id: string): Promise<Category> {
    return this.prisma.category.findUnique({
      where: { category_id: id },
    });
  }

  async update(id: string, data: UpdateCategoryDto, file: Express.Multer.File): Promise<Category> {
    const image = file ? `uploads/category/${file.filename}` : null;
    return this.prisma.category.update({
      where: { category_id: id },
      data: { ...data, image },
    });
  }

  async remove(id: string): Promise<Category> {
    return this.prisma.category.delete({
      where: { category_id: id },
    });
  }
}