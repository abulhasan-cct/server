import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Customer } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { addMinutes } from 'date-fns';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class CustomersService {
  constructor(
    private prisma: DatabaseService,
    private emailService: EmailService,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const { email, phone_number } = createCustomerDto;

    // Check if email already exists
    const existingEmail = await this.findByEmail(email);
    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }

    // Check if phone number already exists
    const existingPhoneNumber = await this.findByPhoneNumber(phone_number);
    if (existingPhoneNumber) {
      throw new BadRequestException('Phone number already exists');
    }

    // If email and phone number are unique, proceed with creating the customer
    const { password, first_name, last_name, address, status, location } =
      createCustomerDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.customer.create({
      data: {
        email,
        password: hashedPassword,
        first_name,
        last_name,
        address,
        phone_number,
        status,
        location,
      },
    });
  }

  async findByEmail(email: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { email },
    });
  }

  async findByPhoneNumber(phone_number: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { phone_number },
    });
  }

  async validateCustomer(
    email: string,
    password: string,
  ): Promise<Customer | null> {
    const customer = await this.findByEmail(email);
    if (customer && (await bcrypt.compare(password, customer.password))) {
      return customer;
    }
    return null;
  }

  async update(
    id: string,
    data: { password?: string; first_name?: string; last_name?: string },
  ): Promise<Customer> {
    const { password, first_name, last_name } = data;
    return this.prisma.customer.update({
      where: { customer_id: id },
      data: {
        password,
        first_name,
        last_name,
      },
    });
  }

  async delete(id: string): Promise<Customer> {
    return this.prisma.customer.delete({
      where: { customer_id: id },
    });
  }

  async generateAndSendOtp(email: string): Promise<void> {
    const customer = await this.findByEmail(email);
    if (!customer) {
      throw new BadRequestException('Customer not found');
    }

    const otpCode = this.generateSixDigitOtp().toString(); // Convert OTP code to string
    const otpExpiresAt = addMinutes(new Date(), 10);

    await this.prisma.customer.update({
      where: { email },
      data: {
        otp_code: otpCode,
        otp_expires_at: otpExpiresAt,
      },
    });

    // Send OTP to the customer's email
    await this.emailService.sendOtp(email, otpCode);
  }

  private generateSixDigitOtp(): number {
    return Math.floor(100000 + Math.random() * 900000); // Generate random 6-digit number
  }

  async verifyOtp(email: string, otpCode: string): Promise<boolean> {
    const customer = await this.findByEmail(email);
    if (!customer) {
      throw new BadRequestException('Customer not found');
    }

    if (customer.otp_code === otpCode && customer.otp_expires_at > new Date()) {
      // Clear OTP after successful verification
      await this.prisma.customer.update({
        where: { email },
        data: {
          otp_code: null,
          otp_expires_at: null,
        },
      });
      return true;
    }
    return false;
  }

  async resetPassword(email: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.customer.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    });
  }
}
