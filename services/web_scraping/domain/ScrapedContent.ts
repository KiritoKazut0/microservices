import { ContentBlock } from "./objectValue/ContentBlock";

export interface ScrapedContentProps {
    id: string;
    url: string;
    title: string;
    subtitle: string;
    date_publish_text: string;
    date_extract: Date;
    document_type: string;
    mainContent: ContentBlock[];
}

export class ScrapedContent {
    id: string;
    url: string;
    title: string;
    subtitle: string;
    date_publish_text: string;
    date_extract: Date;
    document_type: string;
    mainContent: ContentBlock[];

    constructor(props: ScrapedContentProps) {
        this.id = props.id;
        this.url = props.url;
        this.title = props.title;
        this.subtitle = props.subtitle;
        this.date_publish_text = props.date_publish_text,
        this.date_extract = props.date_extract;
        this.document_type = props.document_type;
        this.mainContent = props.mainContent;
    }
}