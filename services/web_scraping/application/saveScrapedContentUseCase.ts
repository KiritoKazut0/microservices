import { ScrapedRepository } from "domain/ScrapedRepository";
import ScrapedService from "./service/scrapperService";
import { ScrapedContent } from "domain/ScrapedContent";

export class SavedScrapendContentUseCase {
    constructor(
        private readonly scrapedRepository: ScrapedRepository,
        private readonly srapedService: ScrapedService,
    ) { }

    async run(url: string): Promise<ScrapedContent> {
        const isDocumentScrapedExist = await this.scrapedRepository.findBySourceUrl(url);
        if (isDocumentScrapedExist){
            console.log("Ya existe")
            return isDocumentScrapedExist
        }
        const scrapedResult = await this.srapedService.scraped(url);
    
        const result = await this.scrapedRepository.save({
            url: url,
            title: scrapedResult.title,
            subtitle: scrapedResult.subtitle,
            date_publish_text: scrapedResult.date_publish_text,
            date_extract: new Date(),
            document_type: scrapedResult.document_type,
            mainContent: scrapedResult.content
        });

        return result;
    }

}