import { Body, Controller, Delete, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { AuthGuard } from 'src/auth/security/auth.guard';
import { RolesGuard } from 'src/auth/security/roles.guard';
import { Roles } from 'src/auth/decorator/role.decorator';
import { RoleType } from 'src/auth/role-type';
import { CreateSubscriptionDTO } from './dto/createSubscription.dto';
import { Request, Response } from 'express';

@Controller('subscription')
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) {}

    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.STUDENT)
    async create(@Body() createSubscriptionDTO: CreateSubscriptionDTO, @Req() req: Request, @Res() res: Response): Promise<any> {
        const userId = req.user['_id'];
        createSubscriptionDTO.userId = userId;
        const payload = await this.subscriptionService.create(createSubscriptionDTO);
        return res.send({ message: 'ok', payload: payload });
    }

    @Get('/page/list')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.STUDENT)
    async findSubscribedPages(@Req() req: Request, @Res() res: Response): Promise<any> {
        const userId = req.user['_id'];
        const payload = await this.subscriptionService.findSubscribedPages(userId);
        return res.send({ message: 'ok', paylod: payload });
    }

    @Get('page/:pageId/news/list')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.STUDENT)
    async findSubscribedPageNews(@Param('pageId') pageId: string, @Req() req: Request, @Res() res: Response): Promise<any> {
        const userId = req.user['_id'];
        const payload = await this.subscriptionService.findSubscribedPageNews(pageId, userId);
        return res.send({ message: 'ok', paylod: payload });
    }

    @Get('/news/list')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.STUDENT)
    async findAllSubscribedPagesNews(@Req() req: Request, @Res() res: Response): Promise<any> {
        const userId = req.user['_id'];
        const payload = await this.subscriptionService.findAllSubscribedPagesNews(userId);
        return res.send({ message: 'ok', paylod: payload });
    }

    @Delete(':subscriptionId')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.STUDENT)
    async deleteOne(@Param('subscriptionId') subscriptionId: string, @Req() req: Request, @Res() res: Response): Promise<any> {
        const userId = req.user['_id'];
        const payload = await this.subscriptionService.deleteOne(subscriptionId, userId);
        return res.send({ message: 'ok', payload: payload });
    }
}
