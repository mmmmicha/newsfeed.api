import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, now } from "mongoose";

export type NewsDocument = HydratedDocument<News>;

@Schema({ timestamps: true })
export class News {
    @Prop()
    title: string;

    @Prop()
    content: string;

    @Prop({
        required: true
    })
    ownerId: string;

    @Prop({
        required: true
    })
    pageId: string;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const NewsSchema = SchemaFactory.createForClass(News);