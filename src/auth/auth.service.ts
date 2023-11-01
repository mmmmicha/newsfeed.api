import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Payload } from './security/payload.interface';
import { RefreshTokenDTO } from './dto/refreshToken.dto';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { UserDocument } from 'src/model/user.model';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async validate(loginInfo: LoginDTO): Promise<{ accessToken: string, refreshToken: string } | undefined> {
        let existedUser = await this.userService.findOneByOptions({ email : loginInfo.email });
        if (!existedUser) throw new UnauthorizedException();

        const isPasswordMatching = await bcrypt.compare(loginInfo.password, existedUser.password);
        if (!isPasswordMatching) throw new UnauthorizedException();

        const payload: Payload = {
            userId: existedUser._id.toString(),
            authorities: existedUser.authorities
        };

        const accessToken = this.createAccessToken(payload);
        const refreshToken = await this.createRefreshToken(payload);

        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
    }

    async tokenValidateUser(payload: Payload): Promise<UserDocument | undefined> {
        let existedUser = this.userService.findOne(payload.userId);
        return existedUser;
    }

    private createAccessToken(payload: Payload): string {
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
            expiresIn: 60 * 60 * 1000,
        })
    };

    private async createRefreshToken(payload: Payload): Promise<string> {
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
            expiresIn: "30d",
        });

        await this.updateRefreshTokenToUser(payload.userId, refreshToken);

        return refreshToken;
    }

    private async updateRefreshTokenToUser(userId: string, refreshToken: string): Promise<void> {
        const hashdedRefreshToken = bcrypt.hashSync(refreshToken, 10);
        await this.userService.updateOne(userId, { hashedRefreshToken: hashdedRefreshToken } as any);
    }

    async removeRefreshToken(userId: string): Promise<void> {
        await this.userService.updateOne(userId, { hashedRefreshToken: null } as any);
    }

    async refresh(refreshTokenDTO: RefreshTokenDTO): Promise<{ accessToken: string, refreshToken: string }> {
        const { refreshToken } = refreshTokenDTO;
    
        const decodedRefreshToken = this.jwtService.verify(refreshToken, { secret: 'refresh_secret' }) as Payload;
    
        const user = await this.userService.findUserIfRefreshTokenMatches(decodedRefreshToken.userId, refreshToken);
        if (!user) {
          throw new UnauthorizedException('Invalid user!');
        }
    
        const payload: Payload = { userId: decodedRefreshToken.userId, authorities: decodedRefreshToken.authorities };
        const newAccessToken = await this.createAccessToken(payload);
        const newRefreshToken = await this.createRefreshToken(payload);
    
        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };
    }
}
