import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { CreateUserInput } from './types';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateUserInput) {
    return this.prisma.user.create({ data });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
