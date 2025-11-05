import { Body, Controller, Inject, Post } from "@nestjs/common";
import AccessUseCase from "application/accessUseCase";
import RegisterUseCase from "application/registerUseCase";
import AccessDto from "infrestructure/dtos/access-dto";
import RegisterDto from "infrestructure/dtos/register-dto";


@Controller('auth')
export class UserController {

    constructor(
        @Inject('AccessUseCase') private readonly accessUseCase: AccessUseCase,
        @Inject('RegisterUseCase') private readonly registerUseCase: RegisterUseCase
    ) { }

    @Post('/access')
    async access(@Body() body: AccessDto ) {
        return await this.accessUseCase.run(body.email, body.password);
    }

    @Post('/register')
    async create(@Body() body: RegisterDto){
        return await this.registerUseCase.run(body);
    }

}