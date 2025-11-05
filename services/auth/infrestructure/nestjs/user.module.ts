import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserModel } from "infrestructure/typeOrm/models/userModel";
import { UserController } from "./user.controller";
import TypeOrmRepository from "infrestructure/typeOrm/persistent/typeOrmRepository";
import AccessUseCase from "application/accessUseCase";
import EncryptService from "infrestructure/service/EncryptService";
import RegisterUseCase from "application/registerUseCase";
import TokenService from "infrestructure/service/TokenService";


@Module({
    imports: [TypeOrmModule.forFeature([UserModel])],
    controllers: [UserController],
    providers: [
        {
            provide: 'UserRepository',
            useClass: TypeOrmRepository
        },
        {
            provide: "AccessUseCase",
            useFactory: (
                userRepository: TypeOrmRepository,
                encryptService: EncryptService,
                tokenService: TokenService
            ) =>
                new AccessUseCase( userRepository, encryptService, tokenService),
            inject: ['UserRepository']
        },
        {
            provide: "RegisterUseCase",
            useFactory: (
                userRepository: TypeOrmRepository,
                encryptService: EncryptService,
                tokenService: TokenService
            ) =>
                new RegisterUseCase(userRepository, encryptService, tokenService),
            inject: ["UserRepository"]
        }
    ]
})
export class UserModule { }