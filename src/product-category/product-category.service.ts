import { Inject, Injectable, Scope } from '@nestjs/common';
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
    return this.prisma.productCategory.findMany({
      where: { id, userId },
    });
  }

  update(id: string, updateProductCategoryDto: UpdateProductCategoryDto) {
    return `This action updates a #${id} productCategory`;
  }

  remove(id: string) {
    return `This action removes a #${id} productCategory`;
  }
}
