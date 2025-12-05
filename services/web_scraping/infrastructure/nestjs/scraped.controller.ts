import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Query,
} from "@nestjs/common";

import { FindByIdScrapedContentUseCase } from "application/findByIdScrapedContentUseCase";
import { FindBySourceUrlUseCase } from "application/findBySourceUrlUseCase";
import { SavedScrapendContentUseCase } from "application/saveScrapedContentUseCase";

import {
  FIND_BY_SOURCE_ULR_USECASE,
  SAVE_SCRAPED_CONTENT_USECASE,
  FIND_BY_ID_USECASE,
} from "core/injection-token";

import { RequestDto } from "infrastructure/dtos/request-dto";

@Controller("scraped")
export class ScrapedController {
    
  constructor(
    @Inject(FIND_BY_ID_USECASE)
    private readonly findByIdUseCase: FindByIdScrapedContentUseCase,

    @Inject(FIND_BY_SOURCE_ULR_USECASE)
    private readonly findBySourceUrlUseCase: FindBySourceUrlUseCase,

    @Inject(SAVE_SCRAPED_CONTENT_USECASE)
    private readonly saveUseCase: SavedScrapendContentUseCase,
  ) {}


  @Get("/:id")
  @HttpCode(200)
  async findById( @Param("id") id: string) {
    return await this.findByIdUseCase.run(id);
  }


  @Get("/url")
  @HttpCode(200)
  async findBySourceUrl( @Query("url") query: RequestDto) {
    if (!query.url) {
    throw new BadRequestException("Query param 'url' is required");
  }
    return await this.findBySourceUrlUseCase.run(query.url);
  }


  @Post("/")
  @HttpCode(201)
  async saveScraped(@Body() body: RequestDto) {
    return await this.saveUseCase.run(body.url);
  }
}
