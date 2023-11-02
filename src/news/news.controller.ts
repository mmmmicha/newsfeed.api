import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { NewsService } from './news.service';
import { AuthGuard } from 'src/auth/security/auth.guard';
import { RolesGuard } from 'src/auth/security/roles.guard';
import { Roles } from 'src/auth/decorator/role.decorator';
import { RoleType } from 'src/auth/role-type';
import { CreateNewsDTO } from './dto/createNews.dto';
import { Request, Response } from 'express';
import { UpdateNewsDTO } from './dto/updateNews.dto';

@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewsService) {}

    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.TEACHER)
    async create(@Body() createNewsDTO: CreateNewsDTO, @Req() req: Request, @Res() res: Response): Promise<any> {
        const userId = req.user['_id'];
        createNewsDTO.ownerId = userId;
        const payload = await this.newsService.create(createNewsDTO);
        return res.send({ message: 'ok', payload: payload });
    }

    // for testing
    @Get('/list')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.TEACHER)
    async find(@Res() res: Response): Promise<any> {
        const payload = await this.newsService.find();
        return res.send({ message: 'ok', payload: payload });
    }

    @Put(':newsId')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.TEACHER)
    async updateOne(@Param('newsId') newsId: string, @Body() updateNewsDTO: UpdateNewsDTO, @Req() req: Request, @Res() res: Response): Promise<any> {
        const userId = req.user['_id'];
        updateNewsDTO.ownerId = userId;
        const payload = await this.newsService.updateOne(newsId, updateNewsDTO);
        return res.send({ message: 'ok', payload: payload })
    }

    @Delete(':newsId')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.TEACHER)
    async deleteOne(@Param('newsId') newsId: string, @Req() req: Request, @Res() res: Response): Promise<any> {
        const userId = req.user['_id'];
        const payload = await this.newsService.deleteOne(newsId, userId);
        return res.send({ message: 'ok', payload: payload })
    }
}
