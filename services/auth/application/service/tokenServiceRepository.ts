
export default interface TokenServiceRepository {
    generateToken(idUser: string): string;
}