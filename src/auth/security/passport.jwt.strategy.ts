import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { AuthService } from "../auth.service";
import { Payload } from "./payload.interface";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService,
        private configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
        })
    }

    async validate(payload: Payload, done: VerifiedCallback): Promise<any> {
        const user = await this.authService.tokenValidateUser(payload);
        if (!user) {
            return done(new UnauthorizedException({ message: 'User not found'}), false);
        }
        done(null, user);
    }
}