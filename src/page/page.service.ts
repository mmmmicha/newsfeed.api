import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Page, PageDocument } from '../model/page.model';
import { CreatePageDTO } from './dto/createPage.dto';
import { UpdatePageDTO } from './dto/updatePage.dto';

@Injectable()
export class PageService {
    constructor(@InjectModel(Page.name) private readonly pageModel: Model<PageDocument>) {}

    async create(createPageDTO: CreatePageDTO): Promise<PageDocument | undefined> {
        const existedPage = await this.pageModel.findOne({ location: createPageDTO.location });
        if (existedPage)
            throw new BadRequestException('already exists page with same location');
        const newPage = new this.pageModel(createPageDTO);
        return newPage.save();
    }

    async find(): Promise<PageDocument[] | undefined> {
        return this.pageModel.find();
    }

    async findOne(pageId: string): Promise<PageDocument | undefined> {
        return this.pageModel.findById(pageId);
    }

    async updateOne(pageId: string, updatePageDTO: UpdatePageDTO): Promise<PageDocument | undefined> {
        const existedPage = await this.pageModel.findOne({ location: updatePageDTO.location });
        if (existedPage)
            throw new BadRequestException('already exists page with same location');
        return this.pageModel.findByIdAndUpdate(pageId, updatePageDTO, { returnOriginal: false });
    }

    async deleteOne(pageId: string): Promise<PageDocument | undefined> {
        return this.pageModel.findByIdAndDelete(pageId);
    }
}
