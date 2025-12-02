import { Module } from "@nestjs/common";
import { ScrapedController } from "./Scraped.controller";
import { FIND_BY_ID_USECASE, FIND_BY_SOURCE_ULR_USECASE, SCRAPED_REPOSITORY } from "core/injection-token";
import { FirestoreScrapingRepository } from "infrestructure/cloud_firestore/firestore-scraping.repository";
import { FindByIdScrapedContentUseCase } from "application/findByIdScrapedContentUseCase";
import { FindBySourceUrlUseCase } from "application/findBySourceUrlUseCase";


@Module({
    imports: [],
    controllers: [ScrapedController],
    providers: [
        {
            provide: SCRAPED_REPOSITORY,
            useClass: FirestoreScrapingRepository
        },{
            provide: FIND_BY_ID_USECASE,
            useFactory: (
                scrapedRepository
            ) => 
                new FindByIdScrapedContentUseCase(scrapedRepository),
                inject: [SCRAPED_REPOSITORY]
        },{
            provide: FIND_BY_SOURCE_ULR_USECASE,
            useFactory: (
                scrapedRepository
            ) => new FindBySourceUrlUseCase(scrapedRepository),
                inject: [SCRAPED_REPOSITORY]
        }, {
          
        }
    ]
})