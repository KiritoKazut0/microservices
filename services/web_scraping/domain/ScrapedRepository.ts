import { ScrapedContent } from "./ScrapedContent";

export interface ScrapedRepository {
    save(content: Omit<ScrapedContent, "id">): Promise<ScrapedContent>
    findById(ContentId: string): Promise<ScrapedContent>
    findBySourceUrl(url:string): Promise<ScrapedContent>
}