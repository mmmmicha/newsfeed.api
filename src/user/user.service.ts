import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './dto/createUser.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../model/user.model';
import { Model, QueryOptions } from 'mongoose';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

    async create(createUserDTO: CreateUserDTO): Promise<any> {
        const existedUser = await this.userModel.findOne({ email: createUserDTO.email });
        if (existedUser)
            throw new BadRequestException('already exists email');
        createUserDTO.password = this.convertPasswordToHash(createUserDTO.password);
        const newUser = new this.userModel(createUserDTO);
        return newUser.save();
    }

    async findOne(userId: string): Promise<UserDocument | undefined> {
        const user = await this.userModel.findById(userId).lean();
        delete user.password;
        delete user.hashedRefreshToken;
        return user;
    }

    async deleteOne(userId: string): Promise<UserDocument> {
        return this.userModel.findByIdAndDelete(userId);
    }

    private convertPasswordToHash(password: string): string {
        const hashedPassword = bcrypt.hashSync(password, 10);
        return hashedPassword;
    };
}