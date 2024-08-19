// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/database/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseService } from 'src/database/database.service';

@Module({
  imports: [AuthModule], // Import AuthModule to provide JwtService
  controllers: [UsersController],
  providers: [UsersService, PrismaService,DatabaseService],
})
export class UsersModule {}
