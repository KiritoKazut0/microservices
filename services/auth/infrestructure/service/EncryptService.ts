import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import EncryptServiceRepository from "application/service/encryptServiceRepository";
import { hash, compare } from "bcrypt"
import { enviroment } from "core/config/enviroment";

@Injectable()
export default class EncryptService implements EncryptServiceRepository {
          private readonly logger = new Logger(EncryptService.name);
        async compare(hashed_password: string, plain_password: string): Promise<boolean> {
                
                try {
                        const isMatch = await compare(plain_password, hashed_password);
                        return isMatch;
                } catch (error) {
                        throw new InternalServerErrorException("Failed to compare password")
                }
        }

        async hash(password: string): Promise<string> {
                try {   
                        const passwordHash = await hash(password, enviroment.SALT_ROUNDS);
                        return passwordHash;
                } catch (error) {
                        throw new InternalServerErrorException("Failed to hash password")
                }
        }
}