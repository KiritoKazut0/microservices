import User from "domain/user";
import UserRepository from "../domain/userRepository";
import EncryptServiceRepository from "./service/encryptServiceRepository";
import TokenServiceRepository from "./service/tokenServiceRepository";

export default class RegisterUseCase {
    constructor(
        private readonly repository: UserRepository,
        private readonly encryptService: EncryptServiceRepository,
        private readonly tokenService: TokenServiceRepository
    ) { }

    async run(user: Omit<User, "id">): Promise<{ user: User, token: string } | null> {
        
        const passwordHash = await this.encryptService.hash(user.password);
        const newUser = await this.repository.register({
            name: user.name,
            email: user.email,
            password: passwordHash
        });
        const token = this.tokenService.generateToken(newUser.id);

        return { user: newUser, token };

    }

}