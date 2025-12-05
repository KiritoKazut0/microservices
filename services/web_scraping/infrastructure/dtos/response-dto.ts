export interface ContentBlock {
    type: string;
    value: string;
}

export interface ScrapedContent {
    id: string;
    url: string;
    title: string;
    subtitle: string;
    date_publish_text: string;
    date_extract: string; 
    document_type: string;
    mainContent: ContentBlock[];
}
