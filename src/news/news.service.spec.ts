import { Test, TestingModule } from '@nestjs/testing';
import { NewsService } from './news.service';
import { getModelToken } from '@nestjs/mongoose';
import { News } from '../model/news.model';
import { Page } from '../model/page.model';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import mongoose from 'mongoose';

const mockPageId = new mongoose.Types.ObjectId().toHexString();
const mockNewsId = new mongoose.Types.ObjectId().toHexString(); 
const mockOwnerId = new mongoose.Types.ObjectId().toHexString();
const differentOwnerId = new mongoose.Types.ObjectId().toHexString();

const mockPage = {
    _id: mockPageId,
    location: '인천광역시 부평구 충선로 19',
    schoolName: '부평고등학교'
}

const mockNews = {
    _id: mockNewsId,
    title: 'hello!',
    content: 'Hello world!',
    pageId: mockPageId,
    ownerId: mockOwnerId,
}

const updatedMockNews = {
    ...mockNews,
    title: 'bye!',
    content: 'Bye world!',
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

    it('should throw NotFoundException when creating news in not found page', async () => {
        let createNewsDTO = {
            title: 'hello!',
            content: 'Hello world!',
            pageId: mockPageId,
            ownerId: mockOwnerId
        }

        const pageModel = module.get(getModelToken(Page.name));
        pageModel.findById = jest.fn().mockResolvedValue(null);

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
            pageId: mockPageId,
            ownerId: mockOwnerId,
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

    it('should throw BadRequestException when updating news with invalid newsId', async () => {
        const invalidNewsId = 'invalidNewsId';
        const updateNewsDTOWithDifferentOwnerId = {
            title: 'bye!',
            content: 'Bye world!',
            pageId: mockPageId,
            ownerId: mockOwnerId,
        };

        try {
            await service.updateOne(invalidNewsId, updateNewsDTOWithDifferentOwnerId);
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
        }
    })

    it('should thorw NotFoundException when updating not found news', async () => {
        const updateNewsDTO = {
            title: 'bye!',
            content: 'Bye world!',
            pageId: mockPageId,
            ownerId: mockOwnerId,
        };

        const newsModel = module.get(getModelToken(News.name));
        newsModel.findById = jest.fn().mockResolvedValue(null);

        try {
            await service.updateOne(mockNewsId, updateNewsDTO);
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
        }
    })

    it('should thorw UnauthorizedException when updating news with different ownerId', async () => {
        const updateNewsDTOWithDifferentOwnerId = {
            title: 'bye!',
            content: 'Bye world!',
            pageId: mockPageId,
            ownerId: differentOwnerId,
        };

        const newsModel = module.get(getModelToken(News.name));
        newsModel.findById = jest.fn().mockResolvedValue(mockNews);

        try {
            await service.updateOne(mockNewsId, updateNewsDTOWithDifferentOwnerId);
        } catch (error) {
            expect(error).toBeInstanceOf(UnauthorizedException);
        }
    })
    
    it('should update a news', async () => {
        const updateNewsDTO = {
            title: 'bye!',
            content: 'Bye world!',
            pageId: mockPageId,
            ownerId: mockOwnerId,
        };
        const updateOptions = {
            returnOriginal: false
        }

        const newsModel = module.get(getModelToken(News.name));

        newsModel.findById = jest.fn().mockResolvedValue(mockNews);
        newsModel.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedMockNews);

        const result = await service.updateOne(mockNewsId, updateNewsDTO);

        expect(result).toEqual(updatedMockNews);
        expect(newsModel.findById).toBeCalledWith(mockNewsId);
        expect(newsModel.findByIdAndUpdate).toBeCalledWith(mockNewsId, updateNewsDTO, updateOptions);
    })

    it('should throw BadRequestException when deleting news with invalid newsId', async () => {
        const invalidNewsId = 'invalidNewsId';

        try {
            await service.deleteOne(invalidNewsId, mockOwnerId);
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
        }
    })

    it('should thorw NotFoundException when deleting not found news', async () => {
        const newsModel = module.get(getModelToken(News.name));
        newsModel.findById = jest.fn().mockResolvedValue(null);

        try {
            await service.deleteOne(mockNewsId, mockOwnerId);
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
        }
    })

    it('should thorw UnauthorizedException when deleting news with different ownerId', async () => {
        const newsModel = module.get(getModelToken(News.name));
        newsModel.findById = jest.fn().mockResolvedValue(mockNews);

        try {
            await service.deleteOne(mockNewsId, differentOwnerId);
        } catch (error) {
            expect(error).toBeInstanceOf(UnauthorizedException);
        }
    })

    it('should delete a news', async () => {
        const newsModel = module.get(getModelToken(News.name));
        newsModel.findById = jest.fn().mockResolvedValue(mockNews);
        newsModel.findByIdAndDelete = jest.fn().mockResolvedValue(mockNews);

        const result = await service.deleteOne(mockNewsId, mockOwnerId);

        expect(result).toEqual(mockNews);
        expect(newsModel.findById).toBeCalledWith(mockNewsId);
        expect(newsModel.findByIdAndDelete).toBeCalledWith(mockNewsId);
    })
});
