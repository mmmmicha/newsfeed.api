import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PageModule } from './page/page.module';
import { NewsModule } from './news/news.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
    imports: [MongooseModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
            uri: configService.get<string>('MONGO_URI'),
            dbName: configService.get<string>('MONGO_DB')
        })
    }), 
    ConfigModule.forRoot({
        isGlobal: true,
    }), 
    UserModule, 
    AuthModule, PageModule, NewsModule, SubscriptionModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
