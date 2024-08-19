import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Put,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as bcrypt from 'bcryptjs';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('signup')
  async signUp(@Body() createCustomerDto: CreateCustomerDto) {
    try {
      const customer = await this.customersService.create(createCustomerDto);
      // Optionally, you can generate and send OTP here
      return { message: 'account created' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error; // Throw any other unexpected errors
    }
  }

  @Post('login')
  async login(
    @Body() { email, password }: { email: string; password: string },
  ) {
    const customer = await this.customersService.validateCustomer(
      email,
      password,
    );
    if (!customer) {
      throw new BadRequestException('Invalid credentials');
    }
    // Generate JWT token
    const payload = { email: customer.email, sub: customer.customer_id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateCustomer(
    @Param('id') id: string,
    @Body()
    updateCustomerDto: {
      password?: string;
      first_name?: string;
      last_name?: string;
    },
  ) {
    const { password, first_name, last_name } = updateCustomerDto;
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;
    return this.customersService.update(id, {
      password: hashedPassword,
      first_name,
      last_name,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteCustomer(@Param('id') id: string) {
    return this.customersService.delete(id);
  }

  @Post('send-otp')
  async sendOtp(@Body() { email }: { email: string }) {
    await this.customersService.generateAndSendOtp(email);
    return { message: 'OTP sent successfully' };
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body() { email, otpCode }: { email: string; otpCode: string },
  ) {
    const isValid = await this.customersService.verifyOtp(email, otpCode);
    if (!isValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    return { message: 'OTP verified successfully' };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() { email }: { email: string }) {
    await this.customersService.generateAndSendOtp(email);
    return { message: 'OTP sent for password reset' };
  }

  @Post('reset-password')
  async resetPassword(
    @Body()
    {
      email,
      otpCode,
      newPassword,
    }: {
      email: string;
      otpCode: string;
      newPassword: string;
    },
  ) {
    const isValid = await this.customersService.verifyOtp(email, otpCode);
    if (!isValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    await this.customersService.resetPassword(email, newPassword);
    return { message: 'Password reset successfully' };
  }
}
