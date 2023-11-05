import { IsOptional, IsString } from "class-validator";

export class UpdatePageDTO {
    @IsOptional()
    @IsString()
    schoolName?: string;
    @IsOptional()
    @IsString()
    ownerId?: string;
}