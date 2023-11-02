import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Page, PageDocument } from 'src/model/page.model';
import { CreatePageDTO } from './dto/createPage.dto';
import { UpdatePageDTO } from './dto/updatePage.dto';

@Injectable()
export class PageService {
    constructor(@InjectModel(Page.name) private readonly pageModel: Model<PageDocument>) {}

    async create(createPageDTO: CreatePageDTO): Promise<PageDocument | undefined> {
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
        return this.pageModel.findByIdAndUpdate(pageId, updatePageDTO);
    }

    async deleteOne(pageId: string): Promise<PageDocument | undefined> {
        return this.pageModel.findByIdAndDelete(pageId);
    }
}