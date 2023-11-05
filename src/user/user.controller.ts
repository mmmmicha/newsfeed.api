import { Body, Controller, Delete, Get, Post, Put, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/createUser.dto';
import { AuthGuard } from '../auth/security/auth.guard';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async create(@Body() createUserDTO: CreateUserDTO, @Res() res: Response): Promise<any> {
        const payload = await this.userService.create(createUserDTO);
        return res.send({ message: 'ok', payload: payload });
    }

    @Get()
    @UseGuards(AuthGuard)
    async findOne(@Req() req: Request, @Res() res: Response): Promise<any> {
        const userId = req.user['_id'];
        const payload = await this.userService.findOne(userId);
        return res.send({ message: 'ok', payload: payload });
    }

    @Delete()
    @UseGuards(AuthGuard)
    async deleteOne(@Req() req: Request, @Res() res: Response): Promise<any> {
        const userId = req.user['_id'];
        const payload = await this.userService.deleteOne(userId);
        return res.send({ message: 'ok', payload: payload });
    }
}
