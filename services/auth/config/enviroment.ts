
export const enviroment = {
    SALT_ROUNDS : Number( process.env.SALT_ROUNDS || '5'),
    NAME_DATABASE : process.env.NAME_DATABASE || "test",
    USERNAME_DATABASE: process.env.USERNAME_DATABASE || 'root',
    PASSWORD_DATABASE:  process.env.PASSWORD_DATABASE || 'root',
    HOST_DATABASE: process.env.HOST_DATABASE || 'localhost',
    PORT_DATABASE : Number(process.env.PORT_DATABASE || '3306'),
    PORT_SERVER : Number(process.env.PORT_SERVER || '3000'),
}