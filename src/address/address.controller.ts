import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post(':customerId')
  async create(
    @Param('customerId') customerId: string,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.addressService.create(customerId, createAddressDto);
  }

  @Get(':customerId')
  async findAll(@Param('customerId') customerId: string) {
    return this.addressService.findAll(customerId);
  }

  @Get('address/:id')
  async findOne(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }

  @Put('address/:id')
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressService.update(id, updateAddressDto);
  }

  @Delete('address/:id')
  async remove(@Param('id') id: string) {
    return this.addressService.remove(id);
  }
}
