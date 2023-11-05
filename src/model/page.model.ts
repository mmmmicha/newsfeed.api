import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type PageDocument = HydratedDocument<Page>

@Schema()
export class Page {
    @Prop({
        unique: true,
        required: true
    })
    location: string;

    @Prop({
        required: true
    })
    schoolName: string;

    @Prop({
        required: true
    })
    ownerId: string;
}

export const PageSchema = SchemaFactory.createForClass(Page);