import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { MongooseModule } from '@nestjs/mongoose';
import { News, NewsSchema } from 'src/model/news.model';
import { Page, PageSchema } from 'src/model/page.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }, { name: Page.name, schema: PageSchema }])],
  controllers: [NewsController],
  providers: [NewsService]
})
export class NewsModule {}
