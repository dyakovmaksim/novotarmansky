import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // проверь правильность пути к твоему prisma.service

@Injectable()
export class HousesService {
  constructor(private prisma: PrismaService) {}

  // Метод для создания домика
  async create(createHouseDto: any) {
    return this.prisma.house.create({
      data: createHouseDto,
    });
  }

  async findAll() {
    return this.prisma.house.findMany();
  }

  async findOne(id: string) {
    return this.prisma.house.findUnique({
      where: { id },
    });
  }
}
