import { Injectable } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt"; 
import TokenServiceRepository from '../../application/service/tokenServiceRepository';


@Injectable()
export default class TokenService implements TokenServiceRepository {
    
    constructor(
        private readonly jwtService: JwtService
    ) {}

    generateToken(idUser: string): string {
        const payload = { sub: idUser };
        return this.jwtService.sign(payload);
    }
}