import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export default class AccessDto {
       @IsNotEmpty()
       @IsEmail()
       email: string;
   
       @IsNotEmpty()
       @IsString()
       @Length(5, 50)
       password: string;
}