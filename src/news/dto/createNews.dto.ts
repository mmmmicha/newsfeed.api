import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateNewsDTO {
    @IsNotEmpty()
    @IsString()
    title: string;
    @IsNotEmpty()
    @IsString()
    content: string;
    @IsNotEmpty()
    @IsString()
    pageId: string;
    @IsOptional()
    @IsString()
    ownerId: string;
}