import { Body, Controller, HttpCode, Inject, Post } from "@nestjs/common";
import AccessUseCase from "application/accessUseCase";
import RegisterUseCase from "application/registerUseCase";
import { ACCESS_USE_CASE, REGISTER_USE_CASE } from "core/tokens/injection-tokens";
import AccessDto from "infrestructure/dtos/access-dto";
import RegisterDto from "infrestructure/dtos/register-dto";


@Controller('auth')
export class UserController {

    constructor(
        @Inject(ACCESS_USE_CASE) private readonly accessUseCase: AccessUseCase,
        @Inject(REGISTER_USE_CASE) private readonly registerUseCase: RegisterUseCase
    ) { }

    @Post('/access')
    @HttpCode(200)
    async access(@Body() body: AccessDto ) {
        return await this.accessUseCase.run(body.email, body.password);
    }

    @Post('/register')
    @HttpCode(201)
    async create(@Body() body: RegisterDto){
        return await this.registerUseCase.run(body);
    }

}