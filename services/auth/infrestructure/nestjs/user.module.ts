import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import AccessUseCase from "application/accessUseCase";
import EncryptService from "infrestructure/service/EncryptService";
import RegisterUseCase from "application/registerUseCase";
import TokenService from "infrestructure/service/TokenService";
import { USER_REPOSITORY, ACCESS_USE_CASE, ENCRYPT_SERVICE, REGISTER_USE_CASE, TOKEN_SERVICE } from "core/tokens/injection-tokens";
import * as admin from "firebase-admin";
import { join } from "node:path";
import { FirestoreUserRepository } from "infrestructure/cloud_firebase/firestore-user.repository";
import { JwtModule } from "@nestjs/jwt";
import { enviroment } from "core/config/enviroment";

const serviceAccountPath = join(process.cwd(), "firebase-service-account.json");

@Module({
    imports: [
         JwtModule.register({
            secret: enviroment.JWT_SECRETE,
            signOptions: {expiresIn: '1h'}
        })
    ],
    controllers: [UserController],
    providers: [
        {
            provide: "FIRESTORE",
            useFactory: () => {
                if (admin.apps.length === 0) {
                    admin.initializeApp({
                        credential: admin.credential.cert(serviceAccountPath)
                    });
                }
                return admin.firestore();
            }
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
            provide: USER_REPOSITORY,
            useFactory: (firestore) => 
                new FirestoreUserRepository(firestore, enviroment.COLLECTION_NAME),
            inject: ["FIRESTORE"]
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