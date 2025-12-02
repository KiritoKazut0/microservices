import { Module } from '@nestjs/common';
import { UserModule } from 'infrestructure/nestjs/user.module';


@Module({
  imports: [
    UserModule
  ]
})
export class AppModule {}
