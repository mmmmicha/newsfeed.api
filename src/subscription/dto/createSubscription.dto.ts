import { IsNotEmpty, IsString } from "class-validator";

export class CreateSubscriptionDTO {
    @IsNotEmpty()
    @IsString()
    userId: string;
    @IsNotEmpty()
    @IsString()
    pageId: string;
}