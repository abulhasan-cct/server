// dto/delete-product-image.dto.ts

import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class DeleteProductImageDto {
  @IsUUID()
  @IsNotEmpty()
  image_id: string;
}


//// ADD ID IN ROUTE AND SENT THE ID IN JSON ALSO  //// IMPORTANT