import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSubscriptionDTO {
    @IsOptional()
    @IsString()
    userId: string;
    @IsNotEmpty()
    @IsString()
    pageId: string;
}