import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateCustomerDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @Length(8, 20, { message: 'Password must be between 8 and 20 characters' })
  password: string;

  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  first_name: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  last_name: string;

  @IsNotEmpty({ message: 'Address is required' })
  @IsString({ message: 'Address must be a string' })
  address: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^\d{10}$/, { message: 'Phone number must be 10 digits long' })
  phone_number: string;

  @IsNotEmpty({ message: 'Status is required' })
  @IsString({ message: 'Status must be a string' })
  status: string;

  @IsNotEmpty({ message: 'Location is required' })
  @IsString({ message: 'Location must be a string' })
  location: string;
}
