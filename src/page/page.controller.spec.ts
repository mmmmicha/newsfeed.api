import { Test, TestingModule } from '@nestjs/testing';
import { PageController } from './page.controller';
import { PageService } from './page.service';
import { getModelToken } from '@nestjs/mongoose';
import { Page } from '../model/page.model';

describe('PageController', () => {
    let controller: PageController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        controllers: [PageController],
        providers: [
            PageService,
            {
                provide: getModelToken(Page.name),
                useValue: Page,
            }
        ],
        }).compile();

        controller = module.get<PageController>(PageController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
