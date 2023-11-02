import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, now } from "mongoose";

export type SubscriptionDocument = HydratedDocument<Subscription>;

@Schema({ timestamps: true })
export class Subscription {
    @Prop({
        required: true
    })
    userId: string;

    @Prop({
        required: true
    })
    pageId: string;

    @Prop({
        default: now()
    })
    createdAt: Date;

    @Prop({
        default: now()
    })
    updatedAt: Date;

    @Prop({
        default: null
    })
    deletedAt: Date;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);