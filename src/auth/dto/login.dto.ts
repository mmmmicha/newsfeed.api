import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDTO {
    @IsNotEmpty()
    @IsString()
    email: string;
    @IsNotEmpty()
    @IsString()
    password: string;
}