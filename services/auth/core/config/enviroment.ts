
export const enviroment = {
    SALT_ROUNDS : Number( process.env.SALT_ROUNDS || '5'),
    COLLECTION_NAME : process.env.COLLECTION_NAME || "user",
    PORT_SERVER : Number(process.env.PORT_SERVER || '3000'),
    JWT_SECRETE: process.env.JWT_SECRETE || "DEFAULT_SECRET"
}