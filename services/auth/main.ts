import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({transform: true}));
  await app.listen(process.env.PORT ?? 3000);
 
}

bootstrap();

/* 

"Para crear un contenedor de docker"

docker run --name mysql-db   -e MYSQL_ROOT_PASSWORD=kirito  -p 3306:3306 -v mysql_data:/var/lib/mysql -d mysql


*/

// docker exec -it mysql-db mysql -u root -p
// # contraseña: kirito
 