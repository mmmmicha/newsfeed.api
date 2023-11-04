import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Payload } from './security/payload.interface';
import { RefreshTokenDTO } from './dto/refreshToken.dto';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from '../model/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async validate(loginInfo: LoginDTO): Promise<{ accessToken: string, refreshToken: string } | undefined> {
        let existedUser = await this.userModel.findOne({ email : loginInfo.email });
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
        let existedUser = this.userModel.findById(payload.userId);
        return existedUser;
    }

    private createAccessToken(payload: Payload): string {
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
            expiresIn: '1h',
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
        await this.userModel.findByIdAndUpdate(userId, { hashedRefreshToken: hashdedRefreshToken } as any);
    }

    async removeRefreshToken(userId: string): Promise<void> {
        await this.userModel.findByIdAndUpdate(userId, { hashedRefreshToken: null } as any);
    }

    async refresh(refreshTokenDTO: RefreshTokenDTO): Promise<{ accessToken: string, refreshToken: string }> {
        const { refreshToken } = refreshTokenDTO;
        let decodedRefreshToken: Payload
        try {
            decodedRefreshToken = this.jwtService.verify(refreshToken, { secret: this.configService.get<string>('REFRESH_TOKEN_SECRET') }) as Payload;
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    
        const user = await this.findUserIfRefreshTokenMatches(decodedRefreshToken.userId, refreshToken);
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

    private async findUserIfRefreshTokenMatches(userId: string, refreshToken: string): Promise<UserDocument | undefined> {
        const user = await this.userModel.findById(userId);
        const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.hashedRefreshToken);

        if (!isRefreshTokenMatching) {
            return null;
        } else {
            return user;
        }
    };
}
