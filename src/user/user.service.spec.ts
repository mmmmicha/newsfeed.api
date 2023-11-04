import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../model/user.model';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { RoleType } from '../auth/role-type';

const createdMockUser = () => {
    const hashedPassword = bcrypt.hashSync('1234', 10);
    return {
        ...mockUser,
        password: hashedPassword
    }
}

const mockUser = {
    _id: 'mockUserId',
    email: 'student@gmail.com',
    password: '1234',
    authorities: ['student']
};

const filteringMockUser = {
    _id: 'mockUserId',
    email: 'student@gmail.com',
    authorities: ['student']
}

describe('UserService', () => {
    let userService: UserService;

    let module: TestingModule;
    beforeEach(async () => {
        module = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getModelToken(User.name),
                    useValue: User,
                },
            ],
        }).compile();

        userService = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(userService).toBeDefined();
    });

    it('should throw BadRequestException when creating a new user with existing email', async () => {
        const createUserDTO = {
            email: 'student@gmail.com',
            password: '1234',
            authorities: [RoleType.STUDENT]
        };

        const userModel = module.get(getModelToken(User.name));
        userModel.findOne = jest.fn().mockResolvedValue(mockUser);

        try {
            await userService.create(createUserDTO);
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
        }
    });

    it('should create a new user', async () => {
        const createUserDTO = {
            email: 'student@gmail.com',
            password: '1234',
            authorities: [RoleType.STUDENT]
        };
        const queryOptions = {
            email: createUserDTO.email
        }

        const createdUser = { ...createdMockUser() };
        const userModel = module.get(getModelToken(User.name));
        userModel.findOne = jest.fn().mockResolvedValue(null);
        userModel.prototype.save = jest.fn().mockResolvedValue(createdUser);

        const result = await userService.create(createUserDTO);

        expect(result).toEqual(createdUser);
        expect(userModel.findOne).toBeCalledWith(queryOptions);
        expect(userModel.prototype.save).toHaveBeenCalled(); // save 메서드가 호출되었는지 확인
    });

    it('should find a user by ID', async () => {
        const userId = 'mockUserId';
        const userModel = module.get(getModelToken(User.name));

        userModel.findById = jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue(mockUser)
        });

        const result = await userService.findOne(userId);

        expect(result).toEqual(filteringMockUser);
        expect(userModel.findById).toHaveBeenCalledWith(userId);
    });

    it('should delete a user by ID', async () => {
        const userId = 'mockUserId';
        const userModel = module.get(getModelToken(User.name));

        userModel.findByIdAndDelete = jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue(mockUser)
        }) 

        const result = await userService.deleteOne(userId);

        expect(result).toEqual(filteringMockUser);
        expect(userModel.findByIdAndDelete).toHaveBeenCalledWith(userId);
    });
});
