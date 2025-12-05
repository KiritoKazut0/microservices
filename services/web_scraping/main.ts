import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "*",
    methods: "GET,POST,DELETE",
    allowedHeaders: "Content-Type, Accept, Authorization",
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(3001);

}

bootstrap();