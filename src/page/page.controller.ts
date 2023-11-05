import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { PageService } from './page.service';
import { CreatePageDTO } from './dto/createPage.dto';
import { AuthGuard } from '../auth/security/auth.guard';
import { RolesGuard } from '../auth/security/roles.guard';
import { Roles } from '../auth/decorator/role.decorator';
import { RoleType } from '../auth/role-type';
import { Request, Response } from 'express';
import { UpdatePageDTO } from './dto/updatePage.dto';

@Controller('page')
export class PageController {
    constructor(private readonly pageService: PageService) {}

    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.TEACHER)
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async create(@Body() createPageDTO: CreatePageDTO, @Req() req: Request, @Res() res: Response): Promise<any> {
        const userId = req.user['_id'];
        createPageDTO.ownerId = userId;
        const payload = await this.pageService.create(createPageDTO);
        return res.send({ message: 'ok', payload: payload });
    }

    @Get('/list')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.TEACHER, RoleType.STUDENT)
    async find(@Res() res: Response): Promise<any> {
        const payload = await this.pageService.find();
        return res.send({ message: 'ok', payload: payload });
    }

    @Get(':pageId')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.TEACHER, RoleType.STUDENT)
    async findOne(@Param('pageId') pageId: string, @Res() res: Response): Promise<any> {
        const payload = await this.pageService.findOne(pageId);
        return res.send({ message: 'ok', payload: payload });
    }

    @Put(':pageId')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.TEACHER)
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async updateOne(@Param('pageId') pageId: string, @Body() updatePageDTO: UpdatePageDTO, @Req() req: Request, @Res() res: Response): Promise<any> {
        const userId = req.user['_id'];
        updatePageDTO.ownerId = userId;
        const payload = await this.pageService.updateOne(pageId, updatePageDTO);
        return res.send({ message: 'ok', payload: payload });
    }

    @Delete(':pageId')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.TEACHER)
    async deleteOne(@Param('pageId') pageId: string, @Req() req: Request, @Res() res: Response): Promise<any> {
        const userId = req.user['_id'];
        const payload = await this.pageService.deleteOne(pageId, userId);
        return res.send({ message: 'ok', payload: payload });
    }
}
