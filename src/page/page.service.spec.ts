import { Test, TestingModule } from '@nestjs/testing';
import { PageService } from './page.service';
import { getModelToken } from '@nestjs/mongoose';
import { Page } from '../model/page.model';

const mockPage = {
    _id: 'mockPageId',
    location: '인천광역시 부평구 충선로 19',
    schoolName: '부평고등학교'
}

const updatedMockPage = {
    _id: 'mockPageId',
    location: '인천광역시 부평구 충선로 18',
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

    it('should create a new page', async () => {
        const createPageDTO = {
            location: '인천광역시 부평구 충선로 19',
            schoolName: '부평고등학교'
        };

        const createdPage = { ...createPageDTO, ...mockPage };
        const pageModel = module.get(getModelToken(Page.name));

        pageModel.prototype.save = jest.fn().mockResolvedValue(createdPage);

        const result = await service.create(createPageDTO);
        
        expect(result).toEqual(createdPage);
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

    it('should update a page', async () => {
        const pageId = 'mockPageId';
        const updatePageDTO = {
            location: '인천광역시 부평구 충선로 18',
            schoolName: '부평초등학교'
        }
        const updateOptions = {
            returnOriginal: false
        }

        const pageModel = module.get(getModelToken(Page.name));

        pageModel.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedMockPage);

        const result = await service.updateOne(pageId, updatePageDTO);

        expect(result).toEqual(updatedMockPage);
        expect(pageModel.findByIdAndUpdate).toBeCalledWith(pageId, updatePageDTO, updateOptions);
    })

    it('should delete a page', async () => {
        const pageId = 'mockPageId';

        const pageModel = module.get(getModelToken(Page.name));

        pageModel.findByIdAndDelete = jest.fn().mockResolvedValue(mockPage);

        const result = await service.deleteOne(pageId);

        expect(result).toEqual(mockPage);
        expect(pageModel.findByIdAndDelete).toBeCalledWith(pageId);
    })
});
