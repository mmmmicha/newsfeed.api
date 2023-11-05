import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';
import { News, NewsDocument } from '../model/news.model';
import { CreateNewsDTO } from './dto/createNews.dto';
import { UpdateNewsDTO } from './dto/updateNews.dto';
import { Page, PageDocument } from '../model/page.model';

@Injectable()
export class NewsService {
    constructor(
        @InjectModel(News.name) private readonly newsModel: Model<NewsDocument>,
        @InjectModel(Page.name) private readonly pageModel: Model<PageDocument>
    ) {}

    async find(): Promise<NewsDocument[] | undefined> {
        return this.newsModel.find();
    }

    async create(createNewsDTO: CreateNewsDTO): Promise<NewsDocument | undefined> {
        const page = await this.pageModel.findById(createNewsDTO.pageId);
        if (!page) 
            throw new NotFoundException('not found page');
        const news = new this.newsModel(createNewsDTO);
        return news.save();
    }

    async updateOne(newsId: string, updateNewsDTO: UpdateNewsDTO): Promise<NewsDocument | undefined> {
        const news = await this.newsModel.findById(newsId);
        if (!news)
            throw new NotFoundException('not found news');
        if (updateNewsDTO.ownerId.toString() !== news.ownerId)
            throw new UnauthorizedException('owner only can update!');
        delete updateNewsDTO.ownerId;
        return this.newsModel.findByIdAndUpdate(newsId, updateNewsDTO, { returnOriginal: false });
    }

    async deleteOne(newsId: string, ownerId: string): Promise<NewsDocument | undefined> {
        // 문제 식별
        // delete() decorator 를 사용할 경우 param data 앞에 \b 가 붙어서 들어오는 경우가 있음
        // 이로 인해 ObjectId 로 캐스팅이 안되어 오류 발생
        // 임시방편으로 replace 문 적용
        const filteredNewsId = newsId.replace("\b", "");
        const news = await this.newsModel.findById(filteredNewsId);
        if (!news)
            throw new NotFoundException('not found news');
        if (ownerId.toString() !== news.ownerId)
            throw new UnauthorizedException('owner only can delete!');
        return this.newsModel.findByIdAndDelete(filteredNewsId);
    }
}
