import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { enviroment } from 'config/enviroment';
import { UserModule } from 'infrestructure/nestjs/user.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: enviroment.HOST_DATABASE,
      username: enviroment.USERNAME_DATABASE,
      password: enviroment.PASSWORD_DATABASE,
      database: enviroment.NAME_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      port: enviroment.PORT_DATABASE
    }),
    UserModule
  ]
})
export class AppModule {}
