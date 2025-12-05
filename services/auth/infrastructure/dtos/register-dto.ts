import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { IsValidPassword } from 'infrastructure/validators/password-strength.validator';

export default class RegisterDto {

    @IsNotEmpty()
    @IsString()
    @Length(5, 50)
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @IsValidPassword({
        message: 'La contraseña es demasiado débil. Utilice una combinación de letras, números y símbolos para reforzarla.'
    })

    password: string;
}