import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: DatabaseService) {}

  async create(userData: { username: string; password: string; role: string }): Promise<User> {
    const { username, password, role } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
      },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.findByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async update(id: string, data: { password?: string; role?: string }): Promise<User> {
    const { password, role } = data;
    const numericId = parseInt(id, 10); // Convert id to number
    return this.prisma.user.update({
      where: { id: numericId }, // Use numericId here
      data: {
        password,
        role,
      },
    });
  }

  async delete(id: string): Promise<User> {
    const numericId = parseInt(id, 10); // Convert id to number
    return this.prisma.user.delete({
      where: { id: numericId }, // Use numericId here
    });
  }
}
