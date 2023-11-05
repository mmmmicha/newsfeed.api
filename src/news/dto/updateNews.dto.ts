import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateNewsDTO {
    @IsOptional()
    @IsString()
    title?: string;
    @IsOptional()
    @IsString()
    content?: string;
    @IsOptional()
    @IsString()
    ownerId: string;
}