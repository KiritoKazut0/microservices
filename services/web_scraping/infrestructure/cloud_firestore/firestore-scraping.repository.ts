import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Firestore, CollectionReference } from 'firebase-admin/firestore';
import { ScrapedContent } from 'domain/ScrapedContent';
import { ScrapedRepository } from 'domain/ScrapedRepository';

@Injectable()
export class FirestoreScrapingRepository implements ScrapedRepository {
  
  private readonly collectionRef: CollectionReference;

  constructor(
    private readonly firestore: Firestore,
    private readonly collectionName: string,
  ) {
    this.collectionRef = this.firestore.collection(this.collectionName);
  }

  async findById(contentId: string): Promise<ScrapedContent> {
    try {
      const doc = await this.collectionRef.doc(contentId).get();

      if (!doc.exists) {
        throw new NotFoundException(`ScrapedContent with ID '${contentId}' not found`);
      }

      return doc.data() as ScrapedContent;

    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException('Failed to fetch document by ID from Firestore');
    }
  }

  async findBySourceUrl(url: string): Promise<ScrapedContent> {
    try {
      const snap = await this.collectionRef
        .where('url', '==', url)
        .limit(1)
        .get();

      if (snap.empty) {
        throw new NotFoundException(`ScrapedContent with URL '${url}' not found`);
      }

      return snap.docs[0].data() as ScrapedContent;

    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException('Failed to search document by URL in Firestore');
    }
  }

  async save(content: Omit<ScrapedContent, 'id'>): Promise<ScrapedContent> {
    try {
      const doc = this.collectionRef.doc();

      const newData: ScrapedContent = {
        id: doc.id,
        ...content,
      };

      await doc.set(newData);

      return newData;

    } catch (err) {
      throw new InternalServerErrorException('Failed to save document in Firestore');
    }
  }
}
