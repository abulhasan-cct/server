// src/product/dto/create-product.dto.ts
import { IsString, IsNumberString, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  SKU: string;

  @IsString()
  description: string;

  @IsString()
  price: string;

  @IsOptional()
  @IsString()
  original_price?: string; // New field

  @IsOptional()
  @IsString()
  discounted_price?: string; // New field

  @IsOptional()
  @IsString()
  promo_code?: string; // New field

  @IsString()
  stock: string;

  @IsString()
  category_id: string;

  @IsString()
  trending: string;

  @IsString()
  status: string;
}
