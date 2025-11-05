
export default interface EncryptServiceRepository {
    hash(password: string): Promise<string>
    compare(hashed_password: string, plain_password: string): Promise<boolean>;
}