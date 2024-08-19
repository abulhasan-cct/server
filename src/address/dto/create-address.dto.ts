// create-address.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  postal_code: string;

  @IsString()
  country: string;
}
