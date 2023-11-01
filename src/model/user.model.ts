import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({
        unique: true,
        required: true,
    })
    email: string

    @Prop({
        unique: true,
        required: true
    })
    password: string

    @Prop()
    hashedRefreshToken: string

    @Prop({
        required: true
    })
    authorities: string[]
}

export const UserSchema = SchemaFactory.createForClass(User);