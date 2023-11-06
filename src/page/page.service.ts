import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
        if (!Types.ObjectId.isValid(pageId))
            throw new BadRequestException('invalid pageId');
        
        return this.pageModel.findById(pageId);
    }

    async updateOne(pageId: string, updatePageDTO: UpdatePageDTO): Promise<PageDocument | undefined> {
        if (!Types.ObjectId.isValid(pageId))
            throw new BadRequestException('invalid pageId');

        const page = await this.pageModel.findById(pageId);

        if (!page)
            throw new NotFoundException('not found page');

        if (updatePageDTO.ownerId.toString() !== page.ownerId)
            throw new UnauthorizedException('owner only can update page');

        return this.pageModel.findByIdAndUpdate(pageId, updatePageDTO, { returnOriginal: false });
    }

    async deleteOne(pageId: string, ownerId: string): Promise<PageDocument | undefined> {
        if (!Types.ObjectId.isValid(pageId))
            throw new BadRequestException('invalid pageId');

        const page = await this.pageModel.findById(pageId);

        if (!page)
            throw new NotFoundException('not found page');

        if (ownerId.toString() !== page.ownerId)
            throw new UnauthorizedException('owner only can delete page');

        return this.pageModel.findByIdAndDelete(pageId);
    }
}
