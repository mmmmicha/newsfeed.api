import { IsOptional, IsString } from "class-validator";

export class UpdatePageDTO {
    @IsOptional()
    @IsString()
    location?: string;
    @IsOptional()
    @IsString()
    schoolName?: string;
}