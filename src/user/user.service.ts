import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './dto/createUser.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../model/user.model';
import { Model, QueryOptions } from 'mongoose';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

    async create(createUserDTO: CreateUserDTO): Promise<any> {
        createUserDTO.password = this.convertPasswordToHash(createUserDTO.password);
        const newUser = new this.userModel(createUserDTO);
        return await newUser.save();
    }

    async findOne(userId: string): Promise<UserDocument | undefined> {
        return await this.userModel.findById(userId);
    }

    async findOneByOptions(queryOptions: QueryOptions): Promise<UserDocument | undefined> {
        return await this.userModel.findOne(queryOptions);
    }

    async deleteOne(userId: string): Promise<UserDocument> {
        return await this.userModel.findByIdAndDelete(userId);
    }

    private convertPasswordToHash(password: string): string {
        const hashedPassword = bcrypt.hashSync(password, 10);
        return hashedPassword;
    };

    async findUserIfRefreshTokenMatches(userId: string, refreshToken: string): Promise<UserDocument | undefined> {
        const user = await this.userModel.findById(userId);
        const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.hashedRefreshToken);

        if (!isRefreshTokenMatching) {
            return null;
        } else {
            return user;
        }
    };

}