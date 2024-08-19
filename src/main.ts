import { ValidationPipe } from '@nestjs/common';
import { Controller, Post, Body, BadRequestException, Put, Delete, Param, UseGuards } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: 'http://localhost:3001', // Allow your frontend origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });


  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (errors) => {
      return new BadRequestException(errors.map(error => {
        return error.constraints ? Object.values(error.constraints).join(', ') : 'Invalid data';
      }));
    },
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(3000);
}

bootstrap();
