import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { enviroment } from 'core/config/enviroment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({transform: true}));
  await app.listen(enviroment.PORT_SERVER ?? 4000);
 
}

bootstrap();
