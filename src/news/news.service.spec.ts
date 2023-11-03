import { Test, TestingModule } from '@nestjs/testing';
import { NewsService } from './news.service';
import { getModelToken } from '@nestjs/mongoose';
import { News } from '../model/news.model';
import { Page } from '../model/page.model';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

const mockNews = {
    _id: 'mockNewsId',
    title: 'hello!',
    content: 'Hello world!',
    pageId: 'mockPageId',
    ownerId: 'mockUserId',
}

const mockPage = {
    _id: 'mockPageId',
    location: '인천광역시 부평구 충선로 19',
    schoolName: '부평고등학교'
}

const updatedMockNews = {
    _id: 'mockNewsId',
    title: 'bye!',
    content: 'Bye world!',
    pageId: 'mockPageId',
    ownerId: 'mockUserId',
}

describe('NewsService', () => {
    let service: NewsService;

    let module: TestingModule;
    beforeEach(async () => {
        module = await Test.createTestingModule({
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

        service = module.get<NewsService>(NewsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should throw UnauthorizedException when creating news with different ownerId', async () => {
        const differentOwnerId = 'differentOwnerId';
        let createNewsDTO = {
            title: 'hello!',
            content: 'Hello world!',
            pageId: 'mockPageId',
            ownerId: 'mockUserId'
        }

        const pageModel = module.get(getModelToken(Page.name));
        pageModel.findById = jest.fn().mockResolvedValue(null);
        createNewsDTO.ownerId = differentOwnerId;

        try {
            await service.create(createNewsDTO);
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
        }
    })

    it('should create a news', async () => {
        const createNewsDTO = {
            title: 'hello!',
            content: 'Hello world!',
            pageId: 'mockPageId',
            ownerId: 'mockUserId'
        }

        const pageModel = module.get(getModelToken(Page.name));
        pageModel.findById = jest.fn().mockResolvedValue(mockPage);

        const newsModel = module.get(getModelToken(News.name));
        newsModel.prototype.save = jest.fn().mockResolvedValue(mockNews);

        const result = await service.create(createNewsDTO);

        expect(result).toEqual(mockNews);
        expect(pageModel.findById).toBeCalledWith(createNewsDTO.pageId);
        expect(newsModel.prototype.save).toBeCalled();
    })

    it('should find news', async () => {
        const newsModel = module.get(getModelToken(News.name));

        newsModel.find = jest.fn().mockResolvedValue([mockNews]);

        const result = await service.find();

        expect(result).toEqual([mockNews]);
        expect(newsModel.find).toBeCalled();
    })

    it('should thorw UnauthorizedException when updating news with different ownerId', async () => {
        const newsId = 'mockNewsId';
        const updateNewsDTOWithDifferentOwnerId = {
            title: 'bye!',
            content: 'Bye world!',
            pageId: 'mockPageId',
            ownerId: 'differentOwnerId',
        };

        const newsModel = module.get(getModelToken(News.name));
        newsModel.findById = jest.fn().mockResolvedValue(mockNews);

        try {
            await service.updateOne(newsId, updateNewsDTOWithDifferentOwnerId);
        } catch (error) {
            expect(error).toBeInstanceOf(UnauthorizedException);
        }
    })
    
    it('should update a news', async () => {
        const newsId = 'mockNewsId';
        const updateNewsDTO = {
            title: 'bye!',
            content: 'Bye world!',
            pageId: 'mockPageId',
            ownerId: 'mockUserId',
        };
        const updateOptions = {
            returnOriginal: false
        }

        const newsModel = module.get(getModelToken(News.name));

        newsModel.findById = jest.fn().mockResolvedValue(mockNews);
        newsModel.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedMockNews);

        const result = await service.updateOne(newsId, updateNewsDTO);

        expect(result).toEqual(updatedMockNews);
        expect(newsModel.findById).toBeCalledWith(newsId);
        expect(newsModel.findByIdAndUpdate).toBeCalledWith(newsId, updateNewsDTO, updateOptions);
    })

    it('should thorw UnauthorizedException when deleting news with different ownerId', async () => {
        const newsId = 'mockNewsId';
        const differentOwnerId = 'differentOwnerId';
        
        const newsModel = module.get(getModelToken(News.name));
        newsModel.findById = jest.fn().mockResolvedValue(mockNews);

        try {
            await service.deleteOne(newsId, differentOwnerId);
        } catch (error) {
            expect(error).toBeInstanceOf(UnauthorizedException);
        }
    })

    it('should delete a news', async () => {
        const newsId = 'mockNewsId';
        const ownerId = 'mockUserId';

        const newsModel = module.get(getModelToken(News.name));
        newsModel.findById = jest.fn().mockResolvedValue(mockNews);
        newsModel.findByIdAndDelete = jest.fn().mockResolvedValue(mockNews);

        const result = await service.deleteOne(newsId, ownerId);

        expect(result).toEqual(mockNews);
        expect(newsModel.findById).toBeCalledWith(newsId);
        expect(newsModel.findByIdAndDelete).toBeCalledWith(newsId);
    })
});
