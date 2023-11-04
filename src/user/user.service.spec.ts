import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../model/user.model';
import * as bcrypt from 'bcrypt';

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

const findingMockUser = {
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

    it('should create a new user', async () => {
        const createUserDTO = {
            email: 'student@gmail.com',
            password: '1234',
            authorities: ['student']
        };

        const createdUser = { ...createdMockUser() };
        const userModel = module.get(getModelToken(User.name));

        userModel.prototype.save = jest.fn().mockResolvedValue(createdUser);

        const result = await userService.create(createUserDTO);

        expect(result).toEqual(createdUser);
        expect(userModel.prototype.save).toHaveBeenCalled(); // save 메서드가 호출되었는지 확인
    });

    it('should find a user by ID', async () => {
        const userId = 'mockUserId';
        const userModel = module.get(getModelToken(User.name));

        userModel.findById = jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue(mockUser)
        });

        const result = await userService.findOne(userId);

        expect(result).toEqual(findingMockUser);
        expect(userModel.findById).toHaveBeenCalledWith(userId);
    });

    it('should delete a user by ID', async () => {
        const userId = 'mockUserId';
        const userModel = module.get(getModelToken(User.name));

        userModel.findByIdAndDelete = jest.fn().mockResolvedValue(mockUser);

        const result = await userService.deleteOne(userId);

        expect(result).toEqual(mockUser);
        expect(userModel.findByIdAndDelete).toHaveBeenCalledWith(userId);
    });
});
