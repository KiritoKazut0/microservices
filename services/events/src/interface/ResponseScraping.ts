
export default interface ResponseScraping {
    id: string;
    url: string;
    title: string;
    subtitle: string | null;
    date_extract: Date | null;
    document_type: string;
    mainContent: ContentBlock[];
}

interface ContentBlock {
    type: string;
    text: string;
}