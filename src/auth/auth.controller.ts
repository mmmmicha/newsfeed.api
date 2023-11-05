import { Body, Controller, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthGuard } from './security/auth.guard';
import { RefreshTokenDTO } from './dto/refreshToken.dto';
import { LoginDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/login')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async login(@Body() loginInfo: LoginDTO, @Res() res: Response): Promise<any> {
        const jwt = await this.authService.validate(loginInfo);
        res.cookie('accessToken', jwt.accessToken, { httpOnly: true });
        res.cookie('refreshToken', jwt.refreshToken, { httpOnly: true });
        return res.send({ message: 'ok', payload: { accessToken: jwt.accessToken, refreshToken: jwt.refreshToken } });
    }

    @Post('/logout')
    @UseGuards(AuthGuard)
    async logout(@Req() req: Request, @Res() res: Response): Promise<any> {
        await this.authService.removeRefreshToken(req.user['_id']);
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return res.send({ message: 'ok' });
    }

    @Post('/refresh')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async refreshToken(@Body() refreshTokenDTO: RefreshTokenDTO, @Res() res: Response): Promise<any> {
        const jwt = await this.authService.refresh(refreshTokenDTO);
        res.cookie('accessToken', jwt.accessToken, { httpOnly: true });
        res.cookie('refreshToken', jwt.refreshToken, { httpOnly: true });
        return res.send({ message: 'ok', payload: { accessToken: jwt.accessToken, refreshToken: jwt.refreshToken } });
    }

}
