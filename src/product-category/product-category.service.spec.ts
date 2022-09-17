import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductCategoryService } from './product-category.service';

describe('ProductCategoryService', () => {
  let service: ProductCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductCategoryService, PrismaService],
    }).compile();

    service = await module.resolve<ProductCategoryService>(
      ProductCategoryService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
