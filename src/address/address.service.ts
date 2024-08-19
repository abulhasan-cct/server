import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from '../database/prisma.service'; // Ensure PrismaService is correctly set up
import { DatabaseService } from '../database/database.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(customerId: string, createAddressDto: CreateAddressDto) {
    return this.prisma.address.create({
      data: {
        ...createAddressDto,
        customer_id: customerId,
      },
    });
  }

  async findAll(customerId: string) {
    return this.prisma.address.findMany({
      where: { customer_id: customerId },
    });
  }

  async findOne(addressId: string) {
    const address = await this.prisma.address.findUnique({
      where: { address_id: addressId },
    });
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return address;
  }

  async update(addressId: string, updateAddressDto: UpdateAddressDto) {
    const address = await this.prisma.address.findUnique({
      where: { address_id: addressId },
    });
    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return this.prisma.address.update({
      where: { address_id: addressId },
      data: { ...updateAddressDto },
    });
  }

  async remove(addressId: string) {
    const address = await this.prisma.address.findUnique({
      where: { address_id: addressId },
    });
    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return this.prisma.address.delete({
      where: { address_id: addressId },
    });
  }
}
