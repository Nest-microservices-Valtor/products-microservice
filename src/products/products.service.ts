import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClientService } from '../helpers-common/db-connection/prisma-client.service';
import { PaginationDto } from '../helpers-common/core';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(private prismaClientService: PrismaClientService) {}

  async create(createProductDto: CreateProductDto) {
    return await this.prismaClientService.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const pageAlt = page || 1;
    const limitAlt = limit || 10;

    const totalPages = await this.prismaClientService.product.count({
      where: { available: true },
    });
    const lastPage = Math.ceil(totalPages / limitAlt);

    return {
      data: await this.prismaClientService.product.findMany({
        skip: (pageAlt - 1) * limitAlt,
        take: limitAlt,
        where: { available: true },
      }),
      meta: {
        page: pageAlt,
        total: totalPages,
        lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.prismaClientService.product.findFirst({
      where: { id, available: true },
    });

    if (!product) {
      throw new RpcException({
        message: `Product with id ${id} not found`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: __, ...updateData } = updateProductDto;
    await this.findOne(id);

    return await this.prismaClientService.product.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    
    const product = await this.prismaClientService.product.update({
      where: { id },
      data: {
        available: false,
      },
    });
    return product;
  }
}
