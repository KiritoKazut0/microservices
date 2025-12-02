import { ScrapedContent, ScrapedContentProps } from "domain/ScrapedContent";
import { ContentBlock } from "domain/objectValue/ContentBlock";

export class ScrapedContentMapper {

  static toFirestore(entity: ScrapedContent) {
    return {
      id: entity.id,
      url: entity.url,
      title: entity.title,
      subtitle: entity.subtitle,
      date_publish_text: entity.date_publish_text,
      date_extract: entity.date_extract,
      document_type: entity.document_type,
      mainContent: entity.mainContent.map(c => ({
        type: c.type,
        text: c.text
      }))
    };
  }

  static toDomain(data: any): ScrapedContent {
    const props: ScrapedContentProps = {
      id: data.id,
      url: data.url,
      title: data.title,
      subtitle: data.subtitle,
      date_publish_text: data.date_publish_text,
      date_extract: data.date_extract instanceof Date 
        ? data.date_extract 
        : new Date(data.date_extract),
      document_type: data.document_type,
      mainContent: data.mainContent.map(
        (c: any) => new ContentBlock(c.type, c.text)
      )
    };

    return new ScrapedContent(props);
  }
}
