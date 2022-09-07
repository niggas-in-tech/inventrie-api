import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { newUser } from './test.fixtures';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, PrismaService],
    }).compile();

    controller = module.get<UserController>(UserController);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('User creation', () => {
    beforeAll(async () => {
      await prisma.user.deleteMany({});
    });

    it('should create new user', async () => {
      const resp = await controller.create(newUser);
      expect(resp.id).toBeDefined();
      expect(resp.email).toBe(newUser.email);
    });

    it('should fail [unique constraint]', async () => {
      try {
        const resp = await controller.create(newUser);
      } catch (error) {}
    });
  });
});
