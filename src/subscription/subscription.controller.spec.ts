import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { getModelToken } from '@nestjs/mongoose';
import { Subscription } from '../model/subscription.model';
import { Page } from '../model/page.model';
import { News } from '../model/news.model';

describe('SubscriptionController', () => {
    let controller: SubscriptionController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        controllers: [SubscriptionController],
        providers: [
            SubscriptionService,
            {
                provide: getModelToken(Subscription.name),
                useValue: Subscription
            },
            {
                provide: getModelToken(Page.name),
                useValue: Page
            },
            {
                provide: getModelToken(News.name),
                useValue: News
            }
        ],
        }).compile();

        controller = module.get<SubscriptionController>(SubscriptionController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
