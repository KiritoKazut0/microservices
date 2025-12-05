import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Firestore, CollectionReference } from 'firebase-admin/firestore';
import { ScrapedContent } from '../../domain/ScrapedContent'; 
import { ScrapedRepository } from '../../domain/ScrapedRepository';
import { ScrapedContentMapper } from './scraped_content.mapper'; 

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

      return ScrapedContentMapper.toDomain(doc.data());

    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException('Failed to fetch document by ID from Firestore');
    }
  }

  async findBySourceUrl(url: string): Promise<ScrapedContent | null> {
    try {
      const snap = await this.collectionRef
        .where('url', '==', url)
        .limit(1)
        .get();

      if (snap.empty) {
        return null
      }

      return ScrapedContentMapper.toDomain(snap.docs[0].data());

    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException('Failed to search document by URL in Firestore');
    }
  }


  async save(entity: ScrapedContent): Promise<ScrapedContent> {
    try {


      const docRef = this.collectionRef.doc();
      entity.id = docRef.id;
      const dataToSave = ScrapedContentMapper.toFirestore(entity);

      await docRef.set(dataToSave);

      return entity;

    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Failed to save document in Firestore');
    }
  }
}
