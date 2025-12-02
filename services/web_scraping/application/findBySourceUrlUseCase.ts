import { ScrapedContent } from "domain/ScrapedContent";
import { ScrapedRepository } from "domain/ScrapedRepository";


export class FindBySourceUrlUseCase {

    constructor(private readonly scrapedRepository: ScrapedRepository){}

    async run (url: string): Promise<ScrapedContent>{
        const result = await this.scrapedRepository.findBySourceUrl(url);
        return result;
    }

}