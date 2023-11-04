import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { RoleType } from "../../auth/role-type";

export class CreateUserDTO {
    @IsNotEmpty()
    @IsString()
    email: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(15)
    password: string;
    @ArrayNotEmpty()
    @IsArray()
    @IsEnum(RoleType, { each: true })
    authorities: RoleType[];
}