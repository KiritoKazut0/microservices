import UserRepository from "domain/userRepository";

export default class DeleteUseCase {
    constructor(
        private readonly repository: UserRepository
    ){}

    async run (id: string): Promise<boolean> {
       return await this.repository.deleteAccount(id);
    }
}