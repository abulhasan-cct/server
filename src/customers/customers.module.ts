import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { PrismaService } from 'src/database/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseService } from 'src/database/database.service';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [AuthModule],
  controllers: [CustomersController],
  providers: [CustomersService, PrismaService, DatabaseService, EmailService],
})
export class CustomersModule {}
