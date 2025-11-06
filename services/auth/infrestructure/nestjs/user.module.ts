import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserModel } from "infrestructure/typeOrm/models/user.model";
import { UserController } from "./user.controller";
import TypeOrmRepository from "infrestructure/typeOrm/persistent/typeOrmRepository";
import AccessUseCase from "application/accessUseCase";
import EncryptService from "infrestructure/service/EncryptService";
import RegisterUseCase from "application/registerUseCase";
import TokenService from "infrestructure/service/TokenService";
import { USER_REPOSITORY, ACCESS_USE_CASE, ENCRYPT_SERVICE, REGISTER_USE_CASE, TOKEN_SERVICE } from "core/tokens/injection-tokens";
import { JwtModule } from "@nestjs/jwt";
import { enviroment } from "core/config/enviroment";


@Module({
    imports: [
        TypeOrmModule.forFeature([UserModel]),
        JwtModule.register({
            secret: enviroment.JWT_SECRETE,
            signOptions: {expiresIn: '1h'}
        })
    ],
    controllers: [UserController],
    providers: [

        {
            provide: USER_REPOSITORY,
            useClass: TypeOrmRepository
        },
        {
            provide: ENCRYPT_SERVICE,
            useClass: EncryptService
        },
        {
            provide: TOKEN_SERVICE,
            useClass: TokenService
        },
        {
            provide: ACCESS_USE_CASE,
            useFactory: (
                userRepository,
                encryptService,
                tokenService
            ) =>
                new AccessUseCase(userRepository, encryptService, tokenService),
            inject: [USER_REPOSITORY, ENCRYPT_SERVICE, TOKEN_SERVICE]
        },
        {
            provide: REGISTER_USE_CASE,
            useFactory: (
                userRepository,
                encryptService,
                tokenService
            ) =>
                new RegisterUseCase(userRepository, encryptService, tokenService),
            inject: [USER_REPOSITORY, ENCRYPT_SERVICE, TOKEN_SERVICE]
        }
    ]
})
export class UserModule { }