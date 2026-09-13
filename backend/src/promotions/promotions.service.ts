import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PromotionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.promotion.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.promotion.findUnique({ where: { id } });
  }

  create(data: {
    title: string;
    description: string;
    badge?: string;
    validUntil: string;
    imagePath: string;
  }) {
    return this.prisma.promotion.create({ data });
  }

  remove(id: string) {
    return this.prisma.promotion.delete({ where: { id } });
  }
}
