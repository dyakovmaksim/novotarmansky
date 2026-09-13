import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.galleryImage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  create(category: string, imagePath: string) {
    return this.prisma.galleryImage.create({ data: { category, imagePath } });
  }

  findOne(id: string) {
    return this.prisma.galleryImage.findUnique({ where: { id } });
  }

  remove(id: string) {
    return this.prisma.galleryImage.delete({ where: { id } });
  }
}
