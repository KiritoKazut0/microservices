import { Module } from "@nestjs/common";
import { ScrapedController } from "./scraped.controller";
import chromium from "chromium";
import {
  FIND_BY_ID_USECASE,
  FIND_BY_SOURCE_ULR_USECASE,
  SCRAPED_SERVICE,
  SAVE_SCRAPED_CONTENT_USECASE,
  SCRAPED_REPOSITORY
} from "core/injection-token";

import { FirestoreScrapingRepository } from "infrastructure/cloud_firestore/firestore-scraping.repository";
import { PuppeteerScrappedService } from "infrastructure/service/puppeteerScrapedServiceImp";
import { FindByIdScrapedContentUseCase } from "application/findByIdScrapedContentUseCase";
import { FindBySourceUrlUseCase } from "application/findBySourceUrlUseCase";
import { SavedScrapendContentUseCase } from "application/saveScrapedContentUseCase";

import { PuppeteerModule } from "nestjs-puppeteer";
import * as admin from "firebase-admin";

import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    PuppeteerModule.forRoot({
      headless: 'new',
      executablePath: chromium.path,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
  ],

  controllers: [ScrapedController],

  providers: [
    // FIRESTORE
    {
      provide: "FIRESTORE",
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        if (admin.apps.length === 0) {
          admin.initializeApp({
            credential: admin.credential.cert({
              projectId: config.get<string>('FIREBASE_PROJECT_ID'),
              clientEmail: config.get<string>('FIREBASE_CLIENT_EMAIL'),
              privateKey: config.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n')
            })
          });
        }
        return admin.firestore();
      }
    },

    {
      provide: SCRAPED_REPOSITORY,
      useFactory: (firestore) =>
        new FirestoreScrapingRepository(firestore, "scrapedContents"),
      inject: ["FIRESTORE"]
    },

    // SCRAPING SERVICE
    {
      provide: SCRAPED_SERVICE,
      useClass: PuppeteerScrappedService
    },

    // USE CASES
    {
      provide: FIND_BY_ID_USECASE,
      useFactory: (repo) => new FindByIdScrapedContentUseCase(repo),
      inject: [SCRAPED_REPOSITORY]
    },

    {
      provide: FIND_BY_SOURCE_ULR_USECASE,
      useFactory: (repo) => new FindBySourceUrlUseCase(repo),
      inject: [SCRAPED_REPOSITORY]
    },

    {
      provide: SAVE_SCRAPED_CONTENT_USECASE,
      useFactory: (repo, service) =>
        new SavedScrapendContentUseCase(repo, service),
      inject: [SCRAPED_REPOSITORY, SCRAPED_SERVICE]
    }
  ]
})
export class ScrapedModule { }
