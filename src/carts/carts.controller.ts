import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { CartService } from './/carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async addToCart(@Body() createCartDto: CreateCartDto) {
    const { quantity, customer_id, product_id } = createCartDto;
    return this.cartService.addToCart(quantity, customer_id, product_id);
  }

  @Get('calculate-total/:customerId')
  async calculateCartTotal(@Param('customerId') customerId: string) {
    return this.cartService.calculateCartTotal(customerId);
  }

  @Get()
  async getAllCarts() {
    return this.cartService.getAllCarts();
  }

  @Get(':id')
  async getCartById(@Param('id') id: string) {
    return this.cartService.getCartById(id);
  }

  @Patch(':id')
  async updateCart(
    @Param('id') id: string,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    const { quantity } = updateCartDto;
    return this.cartService.updateCart(id, quantity);
  }

  @Delete(':id')
  async removeFromCart(@Param('id') id: string) {
    return this.cartService.removeFromCart(id);
  }

  @Get('customer/:customer_id')
  async getCartByCustomerId(@Param('customer_id') customer_id: string) {
    return this.cartService.getCartByCustomerId(customer_id);
  }
}
