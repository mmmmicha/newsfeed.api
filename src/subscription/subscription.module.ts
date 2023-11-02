import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscription, SubscriptionSchema } from 'src/model/subscription.model';
import { Page, PageSchema } from 'src/model/page.model';
import { News, NewsSchema } from 'src/model/news.model';

@Module({
    imports: [MongooseModule.forFeature([
        { name: Subscription.name, schema: SubscriptionSchema }, 
        { name: Page.name, schema: PageSchema },
        { name: News.name, schema: NewsSchema }
    ])],
    controllers: [SubscriptionController],
    providers: [SubscriptionService]
})
export class SubscriptionModule {}
