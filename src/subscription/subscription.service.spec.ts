import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from './subscription.service';
import { getModelToken } from '@nestjs/mongoose';
import { Subscription } from '../model/subscription.model';
import { Page } from '../model/page.model';
import { News } from '../model/news.model';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import mongoose from 'mongoose';

const mockPageId = new mongoose.Types.ObjectId().toHexString();
const mockPageId2 = new mongoose.Types.ObjectId().toHexString();

const mockSubId = new mongoose.Types.ObjectId().toHexString();
const mockSubId2 = new mongoose.Types.ObjectId().toHexString();
const mockSubId3 = new mongoose.Types.ObjectId().toHexString();
const mockSubId4 = new mongoose.Types.ObjectId().toHexString();

const mockNewsId = new mongoose.Types.ObjectId().toHexString();
const mockNewsId2 = new mongoose.Types.ObjectId().toHexString();
const mockNewsId3 = new mongoose.Types.ObjectId().toHexString();
const mockNewsId4 = new mongoose.Types.ObjectId().toHexString();
const mockNewsId5 = new mongoose.Types.ObjectId().toHexString();
const mockNewsId6 = new mongoose.Types.ObjectId().toHexString();
const mockNewsId7 = new mongoose.Types.ObjectId().toHexString();
const mockNewsId8 = new mongoose.Types.ObjectId().toHexString();

const mockUserId = new mongoose.Types.ObjectId().toHexString();
const differentUserId = new mongoose.Types.ObjectId().toHexString();

const mockSub = {
    _id: mockSubId,
    userId: mockUserId,
    pageId: mockPageId,
    createdAt: '2023-11-02T07:56:44.318+00:00',
    updatedAt: '2023-11-02T08:02:00.911+00:00',
    deletedAt: null
}

const deletedMockSub = {
    _id: mockSubId,
    userId: mockUserId,
    pageId: mockPageId,
    createdAt: '2023-11-02T07:56:44.318+00:00',
    updatedAt: '2023-11-02T08:02:00.911+00:00',
    deletedAt: new Date(),
}

const mockSubList = [
    {
        _id: mockSubId,
        userId: mockUserId,
        pageId: mockPageId,
        createdAt: '2023-11-02T07:56:44.318+00:00',
        updatedAt: '2023-11-02T08:02:00.911+00:00',
        deletedAt: '2023-11-02T08:02:00.911+00:00',
    },
    {
        _id: mockSubId2,
        userId: mockUserId,
        pageId: mockPageId,
        createdAt: '2023-11-03T07:56:44.318+00:00',
        updatedAt: '2023-11-03T08:02:00.911+00:00',
        deletedAt: null,
    },
    {
        _id: mockSubId3,
        userId: mockUserId,
        pageId: mockPageId2,
        createdAt: '2023-11-02T07:56:44.318+00:00',
        updatedAt: '2023-11-02T08:02:00.911+00:00',
        deletedAt: '2023-11-02T08:02:00.911+00:00',
    },
    {
        _id: mockSubId4,
        userId: mockUserId,
        pageId: mockPageId2,
        createdAt: '2023-11-03T07:56:44.318+00:00',
        updatedAt: '2023-11-03T08:02:00.911+00:00',
        deletedAt: null,
    },
]

const mockPage = {
    _id: mockPageId,
    location: '인천광역시 부평구 충선로 19',
    schoolName: '부평고등학교'
}

const mockSubPage = {
    _id: mockPageId,
    location: '인천광역시 부평구 충선로 19',
    schoolName: '부평고등학교',
    subscriptionId: mockSubId
}

const mockNewsList = [
    {
        _id: mockNewsId,
        title: 'hello!',
        content: 'Hello world!',
        pageId: mockPageId,
        ownerId: mockUserId,
        createdAt: '2023-11-01T08:00:00.318+00:00',
        updatedAt: '2023-11-01T08:02:00.911+00:00',
    },
    {
        _id: mockNewsId2,
        title: 'hello!',
        content: 'Hello world!',
        pageId: mockPageId,
        ownerId: mockUserId,
        createdAt: '2023-11-02T08:00:00.318+00:00',
        updatedAt: '2023-11-02T08:02:00.911+00:00',
    },
    {
        _id: mockNewsId3,
        title: 'hello!',
        content: 'Hello world!',
        pageId: mockPageId,
        ownerId: mockUserId,
        createdAt: '2023-11-03T08:00:00.318+00:00',
        updatedAt: '2023-11-03T08:02:00.911+00:00',
    },
    {
        _id: mockNewsId4,
        title: 'hello!',
        content: 'Hello world!',
        pageId: mockPageId,
        ownerId: mockUserId,
        createdAt: '2023-11-04T08:00:00.318+00:00',
        updatedAt: '2023-11-04T08:02:00.911+00:00',
    },
    {
        _id: mockNewsId5,
        title: 'hello!',
        content: 'Hello world!',
        pageId: mockPageId2,
        ownerId: mockUserId,
        createdAt: '2023-11-01T08:00:00.318+00:00',
        updatedAt: '2023-11-01T08:02:00.911+00:00',
    },
    {
        _id: mockNewsId6,
        title: 'hello!',
        content: 'Hello world!',
        pageId: mockPageId2,
        ownerId: mockUserId,
        createdAt: '2023-11-02T08:00:00.318+00:00',
        updatedAt: '2023-11-02T08:02:00.911+00:00',
    },
    {
        _id: mockNewsId7,
        title: 'hello!',
        content: 'Hello world!',
        pageId: mockPageId2,
        ownerId: mockUserId,
        createdAt: '2023-11-03T08:00:00.318+00:00',
        updatedAt: '2023-11-03T08:02:00.911+00:00',
    },
    {
        _id: mockNewsId8,
        title: 'hello!',
        content: 'Hello world!',
        pageId: mockPageId2,
        ownerId: mockUserId,
        createdAt: '2023-11-04T08:00:00.318+00:00',
        updatedAt: '2023-11-04T08:02:00.911+00:00',
    }
]

describe('SubscriptionService', () => {
    let service: SubscriptionService;

    let module: TestingModule;
    beforeEach(async () => {
        module = await Test.createTestingModule({
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

        service = module.get<SubscriptionService>(SubscriptionService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should throw NotFoundException when creating a subscription with not found page id', async () => {
        const createSubDTO = {
            userId: mockUserId,
            pageId: mockPageId,
        }

        const pageModel = module.get(getModelToken(Page.name));
        pageModel.findById = jest.fn().mockResolvedValue(null);
        const subModel = module.get(getModelToken(Subscription.name));
        subModel.find = jest.fn().mockResolvedValue([]);

        try {
            await service.create(createSubDTO);
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
        }
    })

    it('should throw BadRequestException when creating a subscription with existing subscriptions', async () => {
        const createSubDTO = {
            userId: mockUserId,
            pageId: mockPageId,
        }

        const pageModel = module.get(getModelToken(Page.name));
        pageModel.findById = jest.fn().mockResolvedValue(mockPage);
        const subModel = module.get(getModelToken(Subscription.name));
        subModel.find = jest.fn().mockResolvedValue([mockSub]);

        try {
            await service.create(createSubDTO);
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
        }
    })

    it('should create a subscription', async () => {
        const createSubDTO = {
            userId: mockUserId,
            pageId: mockPageId,
        }
        const queryOptions = {
            userId: createSubDTO.userId,
            pageId: createSubDTO.pageId,
            deletedAt: null
        }

        const pageModel = module.get(getModelToken(Page.name));
        pageModel.findById = jest.fn().mockResolvedValue(mockPage);
        const subModel = module.get(getModelToken(Subscription.name));
        subModel.find = jest.fn().mockResolvedValue([]);
        const createdMockSub = { ...createSubDTO, ...mockSub };
        subModel.prototype.save = jest.fn().mockResolvedValue(createdMockSub);

        const result = await service.create(createSubDTO);

        expect(result).toEqual(createdMockSub);
        expect(pageModel.findById).toBeCalledWith(createSubDTO.pageId);
        expect(subModel.find).toBeCalledWith(queryOptions);
        expect(subModel.prototype.save).toBeCalled();
    })

    it('should find subscribed pages by userId', async () => {
        const subsIds = [mockSub].map(sub => sub.pageId);
        const subQueryOptions = {
            userId: mockUserId,
            deletedAt: null
        }
        const pageQueryOptions = {
            _id: {
                $in: subsIds,
            }
        }

        const subModel = module.get(getModelToken(Subscription.name));
        subModel.find = jest.fn().mockResolvedValue([mockSub]);

        const pageModel = module.get(getModelToken(Page.name));
        pageModel.find = jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue([mockSubPage]),
        });
    
        const result = await service.findSubscribedPages(mockUserId);
    
        expect(result).toEqual([mockSubPage]);
        expect(subModel.find).toBeCalledWith(subQueryOptions);
        expect(pageModel.find).toBeCalledWith(pageQueryOptions);
    
        expect(pageModel.find().lean).toHaveBeenCalled();
    })

    it('should find subscribed page news by pageId and userId', async () => {
        const subModel = module.get(getModelToken(Subscription.name));
        const subListByUserIdAndPageId = mockSubList.filter(sub => sub.userId === mockUserId && sub.pageId === mockPageId);
        subModel.find = jest.fn().mockResolvedValue(subListByUserIdAndPageId);

        const newsModel = module.get(getModelToken(News.name));
        newsModel.find = jest.fn().mockResolvedValueOnce(mockNewsList.filter(news => news._id === 'mockNewsId2'))
                                    .mockResolvedValueOnce(mockNewsList.filter(news => news._id === 'mockNewsId3' || news._id === 'mockNewsId4'));

        const result = await service.findSubscribedPageNews(mockPageId, mockUserId);
        const filteredNewsList = mockNewsList.filter(news => news._id === 'mockNewsId2' || news._id === 'mockNewsId3' || news._id === 'mockNewsId4');
        const sortedFilteredNewsList = filteredNewsList.sort(function(a:any, b:any) { return b.createdAt - a.createdAt });

        expect(result).toStrictEqual(sortedFilteredNewsList);
    })

    it('should find all subscribed pages news by userId', async () => {
        const subModel = module.get(getModelToken(Subscription.name));
        const subListByUserIdAndPageId = mockSubList.filter(sub => sub.userId === mockUserId);
        subModel.find = jest.fn().mockResolvedValue(subListByUserIdAndPageId);

        const newsModel = module.get(getModelToken(News.name));
        newsModel.find = jest.fn().mockResolvedValueOnce(mockNewsList.filter(news => news._id === 'mockNewsId2'))
                                    .mockResolvedValueOnce(mockNewsList.filter(news => news._id === 'mockNewsId3' || news._id === 'mockNewsId4'))
                                    .mockResolvedValueOnce(mockNewsList.filter(news => news._id === 'mockNewsId6'))
                                    .mockResolvedValueOnce(mockNewsList.filter(news => news._id === 'mockNewsId7' || news._id === 'mockNewsId8'));
        
        const result = await service.findSubscribedPageNews(mockPageId, mockUserId);
        const filteredNewsList = mockNewsList.filter(news => news._id === 'mockNewsId2' || news._id === 'mockNewsId3' || news._id === 'mockNewsId4' || news._id === 'mockNewsId6' || news._id === 'mockNewsId7' || news._id === 'mockNewsId8');
        const sortedFilteredNewsList = filteredNewsList.sort(function(a:any, b:any) { return b.createdAt - a.createdAt });

        expect(result).toStrictEqual(sortedFilteredNewsList);
    })

    it('should throw BadRequestException when deleting subscription with invalid subscriptionId', async () => {
        const invalidSubscriptionId = 'invalidSubscriptionId';
        
        try {
            await service.deleteOne(invalidSubscriptionId, mockUserId);
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
        }
    })

    it('should thorw UnauthorizedException when deleting subscription with different userId', async () => {
        const subModel = module.get(getModelToken(Subscription.name));
        subModel.findById = jest.fn().mockResolvedValue(mockSub);

        try {
            await service.deleteOne(mockSubId, differentUserId);
        } catch (error) {
            expect(error).toBeInstanceOf(UnauthorizedException);
        }
    })

    it('should delete a subscription', async () => {
        const subModel = module.get(getModelToken(Subscription.name));
        subModel.findById = jest.fn().mockResolvedValue(mockSub);
        subModel.findByIdAndUpdate = jest.fn().mockResolvedValue(deletedMockSub);

        const result = await service.deleteOne(mockSubId, mockUserId);

        expect(result.deletedAt).toBeInstanceOf(Date);
        expect(result.deletedAt.getTime()).toBeLessThanOrEqual(new Date().getTime());
        expect(subModel.findById).toBeCalledWith(mockSubId);
    });
});
