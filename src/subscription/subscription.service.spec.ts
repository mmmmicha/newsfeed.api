import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from './subscription.service';
import { getModelToken } from '@nestjs/mongoose';
import { Subscription } from '../model/subscription.model';
import { Page } from '../model/page.model';
import { News } from '../model/news.model';
import { HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';

const mockSub = {
    _id: 'mockSubId',
    userId: 'mockUserId',
    pageId: 'mockPageId',
    createdAt: '2023-11-02T07:56:44.318+00:00',
    updatedAt: '2023-11-02T08:02:00.911+00:00',
    deletedAt: null
}

const deletedMockSub = {
    _id: 'mockSubId',
    userId: 'mockUserId',
    pageId: 'mockPageId',
    createdAt: '2023-11-02T07:56:44.318+00:00',
    updatedAt: '2023-11-02T08:02:00.911+00:00',
    deletedAt: new Date(),
}

const mockSubList = [
    {
        _id: 'mockSubId',
        userId: 'mockUserId',
        pageId: 'mockPageId',
        createdAt: '2023-11-02T07:56:44.318+00:00',
        updatedAt: '2023-11-02T08:02:00.911+00:00',
        deletedAt: '2023-11-02T08:02:00.911+00:00',
    },
    {
        _id: 'mockSubId2',
        userId: 'mockUserId',
        pageId: 'mockPageId',
        createdAt: '2023-11-03T07:56:44.318+00:00',
        updatedAt: '2023-11-03T08:02:00.911+00:00',
        deletedAt: null,
    },
    {
        _id: 'mockSubId3',
        userId: 'mockUserId',
        pageId: 'mockPageId2',
        createdAt: '2023-11-02T07:56:44.318+00:00',
        updatedAt: '2023-11-02T08:02:00.911+00:00',
        deletedAt: '2023-11-02T08:02:00.911+00:00',
    },
    {
        _id: 'mockSubId4',
        userId: 'mockUserId',
        pageId: 'mockPageId2',
        createdAt: '2023-11-03T07:56:44.318+00:00',
        updatedAt: '2023-11-03T08:02:00.911+00:00',
        deletedAt: null,
    },
]

const mockPage = {
    _id: 'mockPageId',
    location: '인천광역시 부평구 충선로 19',
    schoolName: '부평고등학교'
}

const mockSubPage = {
    _id: 'mockPageId',
    location: '인천광역시 부평구 충선로 19',
    schoolName: '부평고등학교',
    subscriptionId: 'mockSubId'
}

const mockNews = {
    _id: 'mockNewsId',
    title: 'hello!',
    content: 'Hello world!',
    pageId: 'mockPageId',
    ownerId: 'mockUserId',
    createdAt: '2023-11-02T08:00:00.318+00:00',
    updatedAt: '2023-11-02T08:02:00.911+00:00',
}

const mockNewsList = [
    {
        _id: 'mockNewsId',
        title: 'hello!',
        content: 'Hello world!',
        pageId: 'mockPageId',
        ownerId: 'mockUserId',
        createdAt: '2023-11-01T08:00:00.318+00:00',
        updatedAt: '2023-11-01T08:02:00.911+00:00',
    },
    {
        _id: 'mockNewsId2',
        title: 'hello!',
        content: 'Hello world!',
        pageId: 'mockPageId',
        ownerId: 'mockUserId',
        createdAt: '2023-11-02T08:00:00.318+00:00',
        updatedAt: '2023-11-02T08:02:00.911+00:00',
    },
    {
        _id: 'mockNewsId3',
        title: 'hello!',
        content: 'Hello world!',
        pageId: 'mockPageId',
        ownerId: 'mockUserId',
        createdAt: '2023-11-03T08:00:00.318+00:00',
        updatedAt: '2023-11-03T08:02:00.911+00:00',
    },
    {
        _id: 'mockNewsId4',
        title: 'hello!',
        content: 'Hello world!',
        pageId: 'mockPageId',
        ownerId: 'mockUserId',
        createdAt: '2023-11-04T08:00:00.318+00:00',
        updatedAt: '2023-11-04T08:02:00.911+00:00',
    },
    {
        _id: 'mockNewsId5',
        title: 'hello!',
        content: 'Hello world!',
        pageId: 'mockPageId2',
        ownerId: 'mockUserId',
        createdAt: '2023-11-01T08:00:00.318+00:00',
        updatedAt: '2023-11-01T08:02:00.911+00:00',
    },
    {
        _id: 'mockNewsId6',
        title: 'hello!',
        content: 'Hello world!',
        pageId: 'mockPageId2',
        ownerId: 'mockUserId',
        createdAt: '2023-11-02T08:00:00.318+00:00',
        updatedAt: '2023-11-02T08:02:00.911+00:00',
    },
    {
        _id: 'mockNewsId7',
        title: 'hello!',
        content: 'Hello world!',
        pageId: 'mockPageId2',
        ownerId: 'mockUserId',
        createdAt: '2023-11-03T08:00:00.318+00:00',
        updatedAt: '2023-11-03T08:02:00.911+00:00',
    },
    {
        _id: 'mockNewsId8',
        title: 'hello!',
        content: 'Hello world!',
        pageId: 'mockPageId2',
        ownerId: 'mockUserId',
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

    it('should throw HttpException with HttpStatus.BAD_REQUEST when creating a subscription with existing subscriptions', async () => {
        const createSubDTO = {
            userId: 'mockUserId',
            pageId: 'mockPageId',
        }

        const subModel = module.get(getModelToken(Subscription.name));
        subModel.find = jest.fn().mockResolvedValue([mockSub]);

        try {
            await service.create(createSubDTO);
        } catch (error) {
            expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
            expect(error).toBeInstanceOf(HttpException);
        }
    })

    it('should create a subscription', async () => {
        const createSubDTO = {
            userId: 'mockUserId',
            pageId: 'mockPageId',
        }
        const queryOptions = {
            userId: createSubDTO.userId,
            pageId: createSubDTO.pageId,
            deletedAt: null
        }

        const subModel = module.get(getModelToken(Subscription.name));
        subModel.find = jest.fn().mockResolvedValue([]);
        const createdMockSub = { ...createSubDTO, ...mockSub };
        subModel.prototype.save = jest.fn().mockResolvedValue(createdMockSub);

        const result = await service.create(createSubDTO);

        expect(result).toEqual(createdMockSub);
        expect(subModel.find).toBeCalledWith(queryOptions);
        expect(subModel.prototype.save).toBeCalled();
    })

    it('should find subscribed pages by userId', async () => {
        const userId = 'mockUserId';
        const subsIds = [mockSub].map(sub => sub.pageId);
        const subQueryOptions = {
            userId: userId,
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
    
        const result = await service.findSubscribedPages(userId);
    
        expect(result).toEqual([mockSubPage]);
        expect(subModel.find).toBeCalledWith(subQueryOptions);
        expect(pageModel.find).toBeCalledWith(pageQueryOptions);
    
        expect(pageModel.find().lean).toHaveBeenCalled();
    })

    it('should find subscribed page news by pageId and userId', async () => {
        const pageId = 'mockPageId';
        const userId = 'mockUserId';

        const subModel = module.get(getModelToken(Subscription.name));
        const subListByUserIdAndPageId = mockSubList.filter(sub => sub.userId === userId && sub.pageId === pageId);
        subModel.find = jest.fn().mockResolvedValue(subListByUserIdAndPageId);

        const newsModel = module.get(getModelToken(News.name));
        newsModel.find = jest.fn().mockResolvedValueOnce(mockNewsList.filter(news => news._id === 'mockNewsId2'))
                                    .mockResolvedValueOnce(mockNewsList.filter(news => news._id === 'mockNewsId3' || news._id === 'mockNewsId4'));

        const result = await service.findSubscribedPageNews(pageId, userId);
        const filteredNewsList = mockNewsList.filter(news => news._id === 'mockNewsId2' || news._id === 'mockNewsId3' || news._id === 'mockNewsId4');
        const sortedFilteredNewsList = filteredNewsList.sort(function(a:any, b:any) { return b.createdAt - a.createdAt });

        expect(result).toStrictEqual(sortedFilteredNewsList);
    })

    it('should find all subscribed pages news by userId', async () => {
        const pageId = 'mockPageId';
        const userId = 'mockUserId';

        const subModel = module.get(getModelToken(Subscription.name));
        const subListByUserIdAndPageId = mockSubList.filter(sub => sub.userId === userId);
        subModel.find = jest.fn().mockResolvedValue(subListByUserIdAndPageId);

        const newsModel = module.get(getModelToken(News.name));
        newsModel.find = jest.fn().mockResolvedValueOnce(mockNewsList.filter(news => news._id === 'mockNewsId2'))
                                    .mockResolvedValueOnce(mockNewsList.filter(news => news._id === 'mockNewsId3' || news._id === 'mockNewsId4'))
                                    .mockResolvedValueOnce(mockNewsList.filter(news => news._id === 'mockNewsId6'))
                                    .mockResolvedValueOnce(mockNewsList.filter(news => news._id === 'mockNewsId7' || news._id === 'mockNewsId8'));
        
        const result = await service.findSubscribedPageNews(pageId, userId);
        const filteredNewsList = mockNewsList.filter(news => news._id === 'mockNewsId2' || news._id === 'mockNewsId3' || news._id === 'mockNewsId4' || news._id === 'mockNewsId6' || news._id === 'mockNewsId7' || news._id === 'mockNewsId8');
        const sortedFilteredNewsList = filteredNewsList.sort(function(a:any, b:any) { return b.createdAt - a.createdAt });

        expect(result).toStrictEqual(sortedFilteredNewsList);
    })

    it('should thorw UnauthorizedException when deleting news with different userId', async () => {
        const subId = 'mockSubId';
        const differentUserId = 'differentUserId';
        
        const subModel = module.get(getModelToken(Subscription.name));
        subModel.findById = jest.fn().mockResolvedValue(mockSub);

        try {
            await service.deleteOne(subId, differentUserId);
        } catch (error) {
            expect(error).toBeInstanceOf(UnauthorizedException);
        }
    })

    it('should delete a subscription', async () => {
        const subId = 'mockSubId';
        const userId = 'mockUserId';
        const deleteSubDTO = {
            deletedAt: new Date(),
        }
        const updateOptions = {
            returnOriginal: false
        }

        const subModel = module.get(getModelToken(Subscription.name));
        subModel.findById = jest.fn().mockResolvedValue(mockSub);
        subModel.findByIdAndUpdate = jest.fn().mockResolvedValue(deletedMockSub);

        const result = await service.deleteOne(subId, userId);

        expect(result.deletedAt).toBeInstanceOf(Date);
        expect(result.deletedAt.getTime()).toBeLessThanOrEqual(new Date().getTime());
        expect(subModel.findById).toBeCalledWith(subId);
    });
});
