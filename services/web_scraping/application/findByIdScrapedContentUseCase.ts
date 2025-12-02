import { ScrapedContent } from "domain/ScrapedContent";
import { ScrapedRepository } from "domain/ScrapedRepository";

export class FindByIdScrapedContentUseCase{
    constructor( private readonly scrapedRepository: ScrapedRepository){}

    async run (id: string): Promise<ScrapedContent> {
        const result = await this.scrapedRepository.findById(id);
        return result;
    }

}