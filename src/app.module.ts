import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module'; // Include AuthModule
import { CustomersModule } from './customers/customers.module';
import { CartsModule } from './carts/carts.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { AddressModule } from './address/address.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    CustomersModule,
    CartsModule,
    WishlistsModule,
    CategoryModule,
    ProductModule,
    ConfigModule.forRoot(),
    AddressModule,
    PaymentModule,
  ], // Include UsersModule and AuthModule
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
