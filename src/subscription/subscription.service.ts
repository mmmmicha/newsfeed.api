import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscription, SubscriptionDocument } from '../model/subscription.model';
import { CreateSubscriptionDTO } from './dto/createSubscription.dto';
import { Page, PageDocument } from '../model/page.model';
import { News, NewsDocument } from '../model/news.model';

@Injectable()
export class SubscriptionService {
    constructor(
        @InjectModel(Subscription.name) private readonly subscriptionModel: Model<SubscriptionDocument>,
        @InjectModel(Page.name) private readonly pageModel: Model<PageDocument>,
        @InjectModel(News.name) private readonly newsModel: Model<NewsDocument>
    ) {}

    async create(createSubscriptionDTO: CreateSubscriptionDTO): Promise<SubscriptionDocument | undefined> {
        const subs = await this.subscriptionModel.find({ userId: createSubscriptionDTO.userId, pageId: createSubscriptionDTO.pageId, deletedAt: null });
        const page = await this.pageModel.findById(createSubscriptionDTO.pageId);
        if (!page)
            throw new NotFoundException('not found page');
        if (subs.length > 0)
            throw new BadRequestException('already exists subscription');
        const newSub = new this.subscriptionModel(createSubscriptionDTO);
        return newSub.save();
    }

    async findSubscribedPages(userId: string): Promise<any[] | undefined> {
        const subs = await this.subscriptionModel.find({ userId: userId, deletedAt: null });
        const subsIds = subs.map(sub => sub.pageId);
        const subPageList = await this.pageModel.find({ _id: { $in: subsIds } }).lean();
        return subPageList.map(subPage => {
            return {
                ...subPage,
                subscriptionId: subs.filter(sub => sub.pageId === subPage._id.toString())[0]._id.toString()
            }
        });
    }

    async findSubscribedPageNews(pageId: string, userId: string): Promise<NewsDocument[] | undefined> {
        const subs = await this.subscriptionModel.find({ userId: userId, pageId: pageId });
        let promisedNews: any[] = [];
        subs.forEach(sub => {
            // 구독이 취소되지 않은 경우는 구독한 시점부터 받은 뉴스 조회
            // 구독이 취소된 경우는 구독한 시점과 취소한 시점 사이에 받은 뉴스 조회
            if (sub.deletedAt === null)
                promisedNews.push(this.newsModel.find({ pageId: pageId, createdAt: { $gte: sub.createdAt }}))
            else 
                promisedNews.push(this.newsModel.find({ pageId: pageId, createdAt: { $gte: sub.createdAt, $lte: sub.deletedAt }}))
        })
        let newsList = await Promise.all(promisedNews);
        let flattedNewsList = newsList.flat();
        let sortedNewsList = flattedNewsList.sort(function(a, b){return b.createdAt - a.createdAt});
        return sortedNewsList;
    }

    async findAllSubscribedPagesNews(userId: string): Promise<NewsDocument[] | undefined> {
        const subs = await this.subscriptionModel.find({ userId: userId });
        let promisedNews: any[] = [];
        subs.forEach(sub => {
            // 구독이 취소되지 않은 경우는 구독한 시점부터 받은 뉴스 조회
            // 구독이 취소된 경우는 구독한 시점과 취소한 시점 사이에 받은 뉴스 조회
            if (sub.deletedAt === null)
                promisedNews.push(this.newsModel.find({ pageId: sub.pageId, createdAt: { $gte: sub.createdAt }}))
            else 
                promisedNews.push(this.newsModel.find({ pageId: sub.pageId, createdAt: { $gte: sub.createdAt, $lte: sub.deletedAt }}))
        })
        let newsList = await Promise.all(promisedNews);
        let flattedNewsList = newsList.flat();
        let sortedNewsList = flattedNewsList.sort(function(a, b){return b.createdAt - a.createdAt});
        return sortedNewsList;
    }

    async deleteOne(subscriptionId: string, userId: string): Promise<SubscriptionDocument | undefined> {
        const filteredSubscriptionId = subscriptionId.replace('\b', '');
        const sub = await this.subscriptionModel.findById(filteredSubscriptionId);
        
        if (userId.toString() !== sub.userId)
            throw new UnauthorizedException('owner can only delete subscription!');
        return this.subscriptionModel.findByIdAndUpdate(filteredSubscriptionId, { deletedAt: new Date() }, { returnOriginal: false });
    }
}
