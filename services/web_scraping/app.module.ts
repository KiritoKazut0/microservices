import { Module } from '@nestjs/common';
import { ScrapedModule } from 'infrestructure/nestjs/scraped.module';

@Module({
  imports: [
    ScrapedModule
  ],
})
export class AppModule {}
