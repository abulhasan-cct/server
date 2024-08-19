import { IsString, IsOptional } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  SKU?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  price?: string;

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
  @IsOptional()
  stock?: string;

  @IsString()
  @IsOptional()
  category_id?: string;

  @IsString()
  @IsOptional()
  trending?: string;

  @IsString()
  @IsOptional()
  status?: string;
}
