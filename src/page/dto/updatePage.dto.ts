import { IsMongoId, IsOptional, IsString } from "class-validator";

export class UpdatePageDTO {
    @IsOptional()
    @IsString()
    schoolName?: string;
    @IsOptional()
    @IsString()
    @IsMongoId()
    ownerId?: string;
}