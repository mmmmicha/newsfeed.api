import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePageDTO {
    @IsNotEmpty()
    @IsString()
    location: string;
    @IsNotEmpty()
    @IsString()
    schoolName: string;
    @IsOptional()
    @IsString()
    ownerId: string;
}