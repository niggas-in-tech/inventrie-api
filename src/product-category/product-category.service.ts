import { HttpException, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';

@Injectable({ scope: Scope.REQUEST })
export class ProductCategoryService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private prisma: PrismaService,
  ) {}

  create(createProductCategoryDto: CreateProductCategoryDto) {
    const id = this.request.res.locals.user.id;
    return this.prisma.productCategory.create({
      data: { ...createProductCategoryDto, User: { connect: { id } } },
    });
  }

  findAll() {
    const userId = this.request.res.locals.user.id;
    return this.prisma.productCategory.findMany({
      where: { userId },
    });
  }

  findOne(id: string) {
    const userId = this.request.res.locals.user.id;
    return this.prisma.productCategory.findFirst({
      where: { id, userId },
    });
  }

  async update(id: string, updateProductCategoryDto: UpdateProductCategoryDto) {
    const userId = this.request.res.locals.user.id;
    const category = await this.prisma.productCategory.findFirst({
      where: { id, userId },
    });

    if (!category) {
      throw new HttpException('Category not found', 404);
    }

    return this.prisma.productCategory.update({
      where: { id },
      data: { ...updateProductCategoryDto, updatedAt: new Date() },
    });
  }

  async remove(id: string) {
    const userId = this.request.res.locals.user.id;
    const category = await this.prisma.productCategory.findFirst({
      where: { id, userId },
    });

    if (!category) {
      throw new HttpException('Category not found', 404);
    }

    return this.prisma.productCategory.delete({
      where: { id },
    });
  }
}
