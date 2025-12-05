import { Body, Controller, Delete, HttpCode, Inject, Param, Post, UnauthorizedException } from "@nestjs/common";
import AccessUseCase from "application/accessUseCase";
import DeleteUseCase from "application/deleteUseCase";
import RegisterUseCase from "application/registerUseCase";
import { ACCESS_USE_CASE, DELETE_USE_CASE, REGISTER_USE_CASE } from "core/tokens/injection-tokens";
import AccessDto from "infrestructure/dtos/access-dto";
import RegisterDto from "infrestructure/dtos/register-dto";


@Controller('auth')
export class UserController {

    constructor(
        @Inject(ACCESS_USE_CASE) private readonly accessUseCase: AccessUseCase,
        @Inject(REGISTER_USE_CASE) private readonly registerUseCase: RegisterUseCase,
        @Inject(DELETE_USE_CASE) private readonly deleteUseCase: DeleteUseCase
    ) { }

    @Post('/access')
    @HttpCode(200)
    async access(@Body() body: AccessDto) {

        const result = await this.accessUseCase.run(body.email, body.password);
        if (!result) {
            throw new UnauthorizedException('Credenciales inválidas.');
        }

        return result;
    }

    @Post('/register')
    @HttpCode(201)
    async create(@Body() body: RegisterDto) {
        return await this.registerUseCase.run(body);
    }

    @Delete("/:id")
    @HttpCode(204)
    async findById(@Param("id") id: string) {
        return await this.deleteUseCase.run(id);
    }

}