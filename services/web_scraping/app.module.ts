import { Module } from '@nestjs/common';
import { ScrapedModule } from './infrastructure/nestjs/scraped.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    ScrapedModule
  ],
})
export class AppModule {}
