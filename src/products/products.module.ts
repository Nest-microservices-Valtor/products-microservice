import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaClientService } from '../helpers-common/db-connection/prisma-client.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaClientService],
})
export class ProductsModule {}
