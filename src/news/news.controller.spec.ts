import { Test, TestingModule } from '@nestjs/testing';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { getModelToken } from '@nestjs/mongoose';
import { News } from '../model/news.model';
import { Page } from '../model/page.model';

describe('NewsController', () => {
    let controller: NewsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        controllers: [NewsController],
        providers: [
            NewsService,
            {
                provide: getModelToken(News.name),
                useValue: News
            },
            {
                provide: getModelToken(Page.name),
                useValue: Page
            },
        ],
        }).compile();

        controller = module.get<NewsController>(NewsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
