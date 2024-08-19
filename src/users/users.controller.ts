import { Controller, Post, Body, BadRequestException, Put, Delete, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as bcrypt from 'bcryptjs';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('signup')
  async signUp(@Body() createUserDto: { username: string; password: string; role: string }) {
    const { username, password, role } = createUserDto;
    const existingUser = await this.usersService.findByUsername(username);
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }
    return this.usersService.create({ username, password, role });
  }

  @Post('login')
  async login(@Body() { username, password }: { username: string; password: string }) {
    const user = await this.usersService.validateUser(username, password);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    // Generate JWT token
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      message: "Logged In"
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: { password?: string; role?: string },
  ) {
    const { password, role } = updateUserDto;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    return this.usersService.update(id, { password: hashedPassword, role });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
