import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import EncryptServiceRepository from "application/service/encryptServiceRepository";
import { hash, compare } from "bcrypt";

@Injectable()
export default class EncryptService implements EncryptServiceRepository {
    private readonly logger = new Logger(EncryptService.name);

    constructor(private readonly config: ConfigService) {}

    async compare(hashed_password: string, plain_password: string): Promise<boolean> {
        try {
            return await compare(plain_password, hashed_password);
        } catch (error) {
            throw new InternalServerErrorException("Failed to compare password");
        }
    }

    async hash(password: string): Promise<string> {
        try {
            const saltRounds = this.config.get<number>('SALT_ROUNDS', 5); 
            return await hash(password, saltRounds);
        } catch (error) {
            throw new InternalServerErrorException("Failed to hash password");
        }
    }
}
