import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({transform: true}));
  await app.listen(process.env.PORT ?? 3000);

}

bootstrap();


// docker run --name mysql-db -e MYSQL_ROOT_PASSWORD=kirito -e MYSQL_USER=root -e MYSQL_PASSWORD=root -p 3306:3306 -d mysql