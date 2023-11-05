import { Test, TestingModule } from '@nestjs/testing';
import { PageService } from './page.service';
import { getModelToken } from '@nestjs/mongoose';
import { Page } from '../model/page.model';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';

const mockPage = {
    _id: 'mockPageId',
    location: '인천광역시 부평구 충선로 19',
    schoolName: '부평고등학교',
    ownerId: 'mockUserId'
}

const updatedMockPage = {
    _id: 'mockPageId',
    location: '인천광역시 부평구 충선로 19',
    schoolName: '부평초등학교',
    ownerId: 'mockUserId'
}

describe('PageService', () => {
    let service: PageService;

    let module: TestingModule;
    beforeEach(async () => {
        module = await Test.createTestingModule({
            providers: [
                PageService,
                {
                    provide: getModelToken(Page.name),
                    useValue: Page,
                }
            ],
        }).compile();

        service = module.get<PageService>(PageService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should thorw BadRequestException when creating with existing location', async () => {
        const createPageDTO = {
            location: '인천광역시 부평구 충선로 19',
            schoolName: '부평고등학교',
            ownerId: 'mockUserId',
        };

        const pageModel = module.get(getModelToken(Page.name));
        pageModel.findOne = jest.fn().mockResolvedValue(mockPage);

        try {
            await service.create(createPageDTO);
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
        }
    })

    it('should create a new page', async () => {
        const createPageDTO = {
            location: '인천광역시 부평구 충선로 19',
            schoolName: '부평고등학교',
            ownerId: 'mockUserId',
        };
        const queryOptions = {
            location: createPageDTO.location
        }

        const createdPage = { ...createPageDTO, ...mockPage };
        const pageModel = module.get(getModelToken(Page.name));
        pageModel.findOne = jest.fn().mockResolvedValue(null);
        pageModel.prototype.save = jest.fn().mockResolvedValue(createdPage);

        const result = await service.create(createPageDTO);
        
        expect(result).toEqual(createdPage);
        expect(pageModel.findOne).toBeCalledWith(queryOptions);
        expect(pageModel.prototype.save).toHaveBeenCalled();
    });

    it('should find pages', async () => {
        const pageModel = module.get(getModelToken(Page.name));

        pageModel.find = jest.fn().mockResolvedValue([mockPage]);

        const result = await service.find();

        expect(result).toEqual([mockPage]);
        expect(pageModel.find).toHaveBeenCalled();
    })

    it('should find a page', async () => {
        const pageId = 'mockPageId';
        const pageModel = module.get(getModelToken(Page.name));

        pageModel.findById = jest.fn().mockResolvedValue(mockPage);

        const result = await service.findOne(pageId);

        expect(result).toEqual(mockPage);
        expect(pageModel.findById).toBeCalledWith(pageId);
    })

    it('should throw NotFoundException when updating not found page', async () => {
        const pageId = 'mockPageId';
        const updatePageDTO = {
            schoolName: '부평초등학교',
            ownerId: 'mockUserId'
        }

        const pageModel = module.get(getModelToken(Page.name));
        pageModel.findById = jest.fn().mockResolvedValue(null);

        try {
            await service.updateOne(pageId, updatePageDTO);
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
        }
    })

    it('should throw BadRequestException when updating page with different ownerId', async () => {
        const pageId = 'mockPageId';
        const updatePageDTO = {
            schoolName: '부평초등학교',
            ownerId: 'differentOwnerId'
        }

        const pageModel = module.get(getModelToken(Page.name));
        pageModel.findById = jest.fn().mockResolvedValue(mockPage);

        try {
            await service.updateOne(pageId, updatePageDTO);
        } catch (error) {
            expect(error).toBeInstanceOf(UnauthorizedException);
        }
    })

    it('should update a page', async () => {
        const pageId = 'mockPageId';
        const updatePageDTO = {
            schoolName: '부평초등학교',
            ownerId: 'mockUserId'
        }
        const updateOptions = {
            returnOriginal: false
        }

        const pageModel = module.get(getModelToken(Page.name));
        pageModel.findById = jest.fn().mockResolvedValue(mockPage);
        pageModel.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedMockPage);

        const result = await service.updateOne(pageId, updatePageDTO);

        expect(result).toEqual(updatedMockPage);
        expect(pageModel.findById).toBeCalledWith(pageId);
        expect(pageModel.findByIdAndUpdate).toBeCalledWith(pageId, updatePageDTO, updateOptions);
    })

    it('should throw NotFoundException when updating not found page', async () => {
        const pageId = 'mockPageId';
        const ownerId = 'mockUserId';

        const pageModel = module.get(getModelToken(Page.name));
        pageModel.findById = jest.fn().mockResolvedValue(null);

        try {
            await service.deleteOne(pageId, ownerId);
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
        }
    })

    it('should throw BadRequestException when deleting page with different ownerId', async () => {
        const pageId = 'mockPageId';
        const differentOwnerId = 'differentOwnerId'

        const pageModel = module.get(getModelToken(Page.name));
        pageModel.findById = jest.fn().mockResolvedValue(mockPage);

        try {
            await service.deleteOne(pageId, differentOwnerId);
        } catch (error) {
            expect(error).toBeInstanceOf(UnauthorizedException);
        }
    })

    it('should delete a page', async () => {
        const pageId = 'mockPageId';
        const ownerId = 'mockUserId';

        const pageModel = module.get(getModelToken(Page.name));
        pageModel.findById = jest.fn().mockResolvedValue(mockPage);
        pageModel.findByIdAndDelete = jest.fn().mockResolvedValue(mockPage);

        const result = await service.deleteOne(pageId, ownerId);

        expect(result).toEqual(mockPage);
        expect(pageModel.findById).toBeCalledWith(pageId);
        expect(pageModel.findByIdAndDelete).toBeCalledWith(pageId);
    })
});
