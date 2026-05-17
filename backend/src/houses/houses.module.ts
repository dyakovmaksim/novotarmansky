import { Module } from '@nestjs/common';
import { HousesService } from './houses.service';
import { HousesController } from './houses.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [HousesController],
  providers: [HousesService, PrismaService],
})
export class HousesModule {}
