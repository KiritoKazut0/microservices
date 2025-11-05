import { IsEmail, IsNotEmpty, IsString, Length} from 'class-validator';

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
    @Length(8, 50)
    password: string;
}