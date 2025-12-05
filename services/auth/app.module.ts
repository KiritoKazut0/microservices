import { Module } from '@nestjs/common';
import { UserModule } from './infrastructure/nestjs/user.module';
import { ConfigModule } from '@nestjs/config';
import enviroment from './core/config/enviroment';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [enviroment]
    }),
    UserModule
  ]
})
export class AppModule {}
