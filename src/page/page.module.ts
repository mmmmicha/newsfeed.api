import { Module } from '@nestjs/common';
import { PageController } from './page.controller';
import { PageService } from './page.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Page, PageSchema } from 'src/model/page.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Page.name, schema: PageSchema }]),
    ],
    controllers: [PageController],
    providers: [PageService]
})
export class PageModule {}
