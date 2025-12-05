import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { CollectionReference, Firestore } from "firebase-admin/firestore";
import User from "domain/user";
import UserRepository from "domain/userRepository";

@Injectable()
export class FirestoreUserRepository implements UserRepository {
  private readonly logger = new Logger(FirestoreUserRepository.name);
  private readonly collectionRef: CollectionReference;

  constructor(
    private readonly firestore: Firestore,
    private readonly collectionName: string
  ) {
    this.collectionRef = this.firestore.collection(this.collectionName);
  }

  async register(userData: Omit<User, "id">): Promise<User> {
    try {

      const existingUser = await this.findByEmail(userData.email);
      if (existingUser) {
        throw new ConflictException(
          `The email '${userData.email}' is already registered.`
        );
      }


      const docRef = this.collectionRef.doc();

      const newUser: User = {
        id: docRef.id,
        ...userData,
      };


      await docRef.set(newUser);

      return newUser;

    } catch (error) {
       if (error instanceof ConflictException) {
      throw error;
    }
      throw new InternalServerErrorException(
        "Error occurred during Firestore user registration."
      );
    }
  }


  async access(email: string, password: string): Promise<User | null> {
      const user = await this.findByEmail(email);
      return user;
  }


async deleteAccount(id: string): Promise<boolean> {
  try {
    const docRef = this.collectionRef.doc(id);
    const docSnap = await docRef.get();

  
    if (!docSnap.exists) {
      throw new NotFoundException(`User with id '${id}' does not exist.`);
    }

    await docRef.delete();

    return true;
  } catch (error) {

    if (error instanceof NotFoundException) {
      throw error;
    }

    throw new InternalServerErrorException(
      "Error occurred while deleting the user from Firestore."
    );
  }
}


  private async findByEmail(email: string): Promise<User | null> {
    try {
      const snap = await this.collectionRef
        .where("email", "==", email)
        .limit(1)
        .get();

      if (snap.empty) return null;

      return snap.docs[0].data() as User;

    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        "Error accessing Firestore when searching for email."
      );
    }
  }
}
