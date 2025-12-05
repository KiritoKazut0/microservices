import User from "./user"

export default interface UserRepository {
    access(email: string, password: string): Promise<User | null>
    register(user: Omit<User, "id">): Promise<User>
    deleteAccount(id: string): Promise<boolean>
}
