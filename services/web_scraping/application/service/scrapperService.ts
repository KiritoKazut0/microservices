
export default interface ScrapedService {
    scraped(url: string): Promise<{
        title: string;
        subtitle: string;
        date_publish_text: string,
        document_type: string,
        content: { type: string; text: string }[];
    }>;
}
