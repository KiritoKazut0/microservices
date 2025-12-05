import User from "../domain/user";
import UserRepository from "../domain/userRepository";
import EncryptServiceRepository from "./service/encryptServiceRepository";
import TokenServiceRepository from "./service/tokenServiceRepository";

export default class AccessUseCase {
    constructor(
        private readonly repository: UserRepository,
        private readonly encryptService: EncryptServiceRepository,
        private readonly tokenService: TokenServiceRepository
    ) { }

    async run(email: string, password: string): Promise<{ user: User, token: string } | null> {

        const user = await this.repository.access(email, password);
        if (!user) return null

        if (!await this.encryptService.compare(user.password, password)) return null
        const token = this.tokenService.generateToken(user.id);
        
        return {user: user, token};
    }


}