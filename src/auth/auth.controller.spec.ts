import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashPassword } from 'src/utils/helpers/auth.helpers';
import { AuthController } from './auth.controller';
import { testLoginData } from './test.fixtures';

describe('AuthController', () => {
  let controller: AuthController;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [PrismaService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Sign in', () => {
    beforeAll(async () => {
      await prisma.user.deleteMany({});
      const { hash, salt } = await hashPassword(testLoginData.password);
      await prisma.user.create({
        data: { ...testLoginData, password: hash, salt },
      });
    });
    it('should sign in a user', async () => {
      const res = await controller.login(testLoginData);
      expect(res.id).toBeDefined();
      expect(res.token).toBeDefined();
    });
    it('should FAIL to sign in a user', async () => {
      try {
        await controller.login({
          ...testLoginData,
          password: 'wrong password',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });
});
