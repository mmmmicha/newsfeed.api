import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateNewsDTO {
    @IsNotEmpty()
    @IsString()
    title: string;
    @IsNotEmpty()
    @IsString()
    content: string;
    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    pageId: string;
    @IsOptional()
    @IsString()
    @IsMongoId()
    ownerId: string;
}