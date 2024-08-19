import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart, Order, Shipment, OrderTracking } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
// import { Decimal } from '@prisma/client/runtime';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(
    quantity: number,
    customer_id: string,
    product_id: string,
  ): Promise<Cart> {
    const existingCartItem = await this.prisma.cart.findFirst({
      where: { customer_id, product_id },
    });

    if (existingCartItem) {
      return this.prisma.cart.update({
        where: { cart_id: existingCartItem.cart_id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      return this.prisma.cart.create({
        data: { quantity, customer_id, product_id },
      });
    }
  }

  async getAllCarts(): Promise<Cart[]> {
    return this.prisma.cart.findMany({
      include: {
        product: true,
        customer: true,
      },
    });
  }

  async getCartById(id: string): Promise<Cart> {
    const cart = await this.prisma.cart.findUnique({
      where: { cart_id: id },
      include: {
        product: true,
        customer: true,
      },
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }

    return cart;
  }

  async getCartByCustomerId(customer_id: string): Promise<any> {
    const carts = await this.prisma.cart.findMany({
      where: { customer_id },
      include: {
        product: {
          include: {
            images: {
              take: 1,
            },
          },
        },
      },
    });

    if (!carts.length) {
      throw new NotFoundException(
        `No carts found for customer with ID ${customer_id}`,
      );
    }

    return carts;
  }

  async updateCart(id: string, quantity: number): Promise<Cart> {
    const cart = await this.prisma.cart.findUnique({
      where: { cart_id: id },
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }

    return this.prisma.cart.update({
      where: { cart_id: id },
      data: { quantity },
    });
  }

  async removeFromCart(id: string): Promise<Cart> {
    const cart = await this.prisma.cart.findUnique({
      where: { cart_id: id },
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }

    return this.prisma.cart.delete({
      where: { cart_id: id },
    });
  }

  async calculateCartTotal(
    customer_id: string,
  ): Promise<{ totalQuantity: number; totalPrice: Decimal }> {
    const carts = await this.prisma.cart.findMany({
      where: { customer_id },
      include: { product: true },
    });

    let totalQuantity = 0;
    let totalPrice = new Decimal(0);

    carts.forEach((cart) => {
      totalQuantity += cart.quantity;
      totalPrice = totalPrice.plus(
        new Decimal(cart.product.price).times(cart.quantity),
      );
    });

    return { totalQuantity, totalPrice };
  }

  // async proceedToPayment(customer_id: string): Promise<any> {
  //   const { totalPrice } = await this.calculateCartTotal(customer_id);

  //   // Assuming you're using a payment gateway, replace the following with actual payment gateway integration
  //   const paymentResult = await this.paymentGateway.charge({
  //     amount: totalPrice.toNumber(), // Convert Decimal to number if required
  //     currency: 'USD',
  //     customer: customer_id,
  //   });

  //   if (paymentResult.success) {
  //     return this.createOrder(customer_id);
  //   } else {
  //     throw new Error('Payment failed');
  //   }
  // }

  async createOrder(customer_id: string): Promise<Order> {
    const carts = await this.prisma.cart.findMany({
      where: { customer_id },
      include: { product: true },
    });

    if (carts.length === 0) {
      throw new Error('Cart is empty');
    }

    const totalPrice = carts.reduce((acc, cart) => {
      return acc.plus(new Decimal(cart.product.price).times(cart.quantity));
    }, new Decimal(0));

    const order = await this.prisma.order.create({
      data: {
        customer_id,
        total_price: totalPrice,
        order_date: new Date(),
        orderItems: {
          create: carts.map((cart) => ({
            product_id: cart.product_id,
            quantity: cart.quantity,
            price: new Decimal(cart.product.price),
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    // Clear the cart after creating the order
    await this.prisma.cart.deleteMany({ where: { customer_id } });

    return order;
  }

  async createShipment(
    order_id: string,
    shipmentDetails: any,
  ): Promise<Shipment> {
    return this.prisma.shipment.create({
      data: {
        order_id,
        shipment_date: new Date(),
        ...shipmentDetails,
      },
    });
  }

  async createOrderTracking(
    order_id: string,
    status: string,
  ): Promise<OrderTracking> {
    return this.prisma.orderTracking.create({
      data: {
        order_id,
        status,
      },
    });
  }
}
