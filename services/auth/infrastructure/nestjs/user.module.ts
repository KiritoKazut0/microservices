import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import AccessUseCase from "../../application/accessUseCase";
import EncryptService from "../service/EncryptService";
import RegisterUseCase from "../../application/registerUseCase";
import TokenService from "../service/TokenService";
import { USER_REPOSITORY, ACCESS_USE_CASE, ENCRYPT_SERVICE, REGISTER_USE_CASE, TOKEN_SERVICE, DELETE_USE_CASE } from "../../core/tokens/injection-tokens"; 
import * as admin from "firebase-admin";
import { FirestoreUserRepository } from "../cloud_firebase/firestore-user.repository";
import { JwtModule } from "@nestjs/jwt";
import DeleteUseCase from "../../application/deleteUseCase";
import { ConfigModule, ConfigService } from "@nestjs/config";


@Module({
    imports: [
        ConfigModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>("JWT_SECRETE"),
                signOptions: { expiresIn: '1h' }
            }),
        })
    ],
    controllers: [UserController],
    providers: [
        {
            provide: "FIRESTORE",
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                if (admin.apps.length === 0) {
                    admin.initializeApp({
                        credential: admin.credential.cert({
                            projectId: config.get<string>('FIREBASE_PROJECT_ID'),
                            clientEmail: config.get<string>('FIREBASE_CLIENT_EMAIL'),
                            privateKey: config.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n')
                        })
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
            useFactory: (firestore, config: ConfigService) =>
                new FirestoreUserRepository(firestore, config.get<string>("COLLECTION_NAME") ?? "user"),
            inject: ["FIRESTORE", ConfigService]
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
        }, {
            provide: DELETE_USE_CASE,
            useFactory: (
                userRepository
            ) => new DeleteUseCase(userRepository),
            inject: [USER_REPOSITORY]
        }
    ]
})
export class UserModule { }