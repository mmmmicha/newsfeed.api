import { Test, TestingModule } from '@nestjs/testing';
import { PageService } from './page.service';
import { getModelToken } from '@nestjs/mongoose';
import { Page } from '../model/page.model';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import mongoose from 'mongoose';

const mockPageId = new mongoose.Types.ObjectId().toHexString();
const mockOwnerId = new mongoose.Types.ObjectId().toHexString();
const differentOwnerId = new mongoose.Types.ObjectId().toHexString();

const mockPage = {
    _id: mockPageId,
    location: '인천광역시 부평구 충선로 19',
    schoolName: '부평고등학교',
    ownerId: mockOwnerId
}

const updatedMockPage = {
    ...mockPage,
    schoolName: '부평초등학교'
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
            ownerId: mockOwnerId,
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
            ownerId: mockOwnerId,
        };
        const queryOptions = {
            location: createPageDTO.location
        }

        const createdPage = { ...mockPage, ...createPageDTO };
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

    it('should throw BadRequestException when finding page with invalid pageId', async () => {
        const invalidPageId = 'invalidPageId';

        try {
            await service.findOne(invalidPageId);
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
        }
    })

    it('should find a page', async () => {
        const pageModel = module.get(getModelToken(Page.name));

        pageModel.findById = jest.fn().mockResolvedValue(mockPage);

        const result = await service.findOne(mockPageId);

        expect(result).toEqual(mockPage);
        expect(pageModel.findById).toBeCalledWith(mockPageId);
    })

    it('should throw BadRequestException when updating page with invalid pageId', async () => {
        const invalidPageId = 'invalidPageId';
        const updatePageDTO = {
            schoolName: '부평초등학교',
            ownerId: mockOwnerId
        }

        try {
            await service.updateOne(invalidPageId, updatePageDTO);
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
        }
    })

    it('should throw NotFoundException when updating not found page', async () => {
        const updatePageDTO = {
            schoolName: '부평초등학교',
            ownerId: mockOwnerId
        }

        const pageModel = module.get(getModelToken(Page.name));
        pageModel.findById = jest.fn().mockResolvedValue(null);

        try {
            await service.updateOne(mockPageId, updatePageDTO);
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
        }
    })

    it('should throw BadRequestException when updating page with different ownerId', async () => {
        const updatePageDTO = {
            schoolName: '부평초등학교',
            ownerId: differentOwnerId,
        }

        const pageModel = module.get(getModelToken(Page.name));
        pageModel.findById = jest.fn().mockResolvedValue(mockPage);

        try {
            await service.updateOne(mockPageId, updatePageDTO);
        } catch (error) {
            expect(error).toBeInstanceOf(UnauthorizedException);
        }
    })

    it('should update a page', async () => {
        const updatePageDTO = {
            schoolName: '부평초등학교',
            ownerId: mockOwnerId
        }
        const updateOptions = {
            returnOriginal: false
        }

        const pageModel = module.get(getModelToken(Page.name));
        pageModel.findById = jest.fn().mockResolvedValue(mockPage);
        pageModel.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedMockPage);

        const result = await service.updateOne(mockPageId, updatePageDTO);

        expect(result).toEqual(updatedMockPage);
        expect(pageModel.findById).toBeCalledWith(mockPageId);
        expect(pageModel.findByIdAndUpdate).toBeCalledWith(mockPageId, updatePageDTO, updateOptions);
    })

    it('should throw BadRequestException when deleting page with invalid pageId', async () => {
        const invalidPageId = 'invalidPageId';
        
        try {
            await service.deleteOne(invalidPageId, mockOwnerId);
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
        }
    })

    it('should throw NotFoundException when deleting not found page', async () => {
        const pageModel = module.get(getModelToken(Page.name));
        pageModel.findById = jest.fn().mockResolvedValue(null);

        try {
            await service.deleteOne(mockPageId, mockOwnerId);
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
        }
    })

    it('should throw BadRequestException when deleting page with different ownerId', async () => {
        const pageModel = module.get(getModelToken(Page.name));
        pageModel.findById = jest.fn().mockResolvedValue(mockPage);

        try {
            await service.deleteOne(mockPageId, differentOwnerId);
        } catch (error) {
            expect(error).toBeInstanceOf(UnauthorizedException);
        }
    })

    it('should delete a page', async () => {
        const pageModel = module.get(getModelToken(Page.name));
        pageModel.findById = jest.fn().mockResolvedValue(mockPage);
        pageModel.findByIdAndDelete = jest.fn().mockResolvedValue(mockPage);

        const result = await service.deleteOne(mockPageId, mockOwnerId);

        expect(result).toEqual(mockPage);
        expect(pageModel.findById).toBeCalledWith(mockPageId);
        expect(pageModel.findByIdAndDelete).toBeCalledWith(mockPageId);
    })
});
