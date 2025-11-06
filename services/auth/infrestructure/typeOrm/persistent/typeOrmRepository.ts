import { InjectRepository } from "@nestjs/typeorm";
import User from "domain/user";
import UserRepository from "domain/userRepository";
import { UserModel } from "../models/user.model";
import { Repository, QueryFailedError } from "typeorm";
import { ConflictException, InternalServerErrorException, NotFoundException, Logger } from "@nestjs/common";


export default class TypeOrmRepository implements UserRepository {
  private readonly logger = new Logger(TypeOrmRepository.name);
    constructor(
        @InjectRepository(UserModel)
        private readonly repository: Repository<UserModel>
    ) { }


   async access(email: string, password: string): Promise<User | null> {
       try {
         const user = await this.findByEmail(email);
        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user;
       } catch (error) {
            throw error;
       }
    }


    async register(userData: Omit<User, "id">): Promise<User> {
        try {
            const existingUser = await this.findByEmail(userData.email);

            if (existingUser) {
                throw new ConflictException(`The email '${userData.email}' is already registered.`);
            }


            const newUserModel = this.repository.create(userData);
            const savedUser = await this.repository.save(newUserModel);
            return savedUser;

        } catch (error) {
            if (error instanceof QueryFailedError) {
               this.logger.error(error)
                throw new InternalServerErrorException("A database error ocurred while create for user")
            } else if(error instanceof ConflictException){
                throw error;
            }
            throw new InternalServerErrorException('A database error occurred during user registration.');
        }
    }


    private async findByEmail(email: string): Promise<User | null> {
        try {
            const user = await this.repository.findOneBy({ email });
            return user;
        } catch (error) {
             this.logger.error(error)
            if (error instanceof QueryFailedError) {
                
                
                throw new InternalServerErrorException('A database error occurred while searching for the email.');
            }
            throw new InternalServerErrorException('An unexpected error occurred accessing the database.');
        }
    }
}