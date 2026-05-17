import {
  Injectable,
  OnModuleInit,
  BeforeApplicationShutdown,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, BeforeApplicationShutdown
{
  constructor() {
    // В Prisma 7 конструктор оставляем пустым, он сам подтянет конфиг
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async beforeApplicationShutdown() {
    await this.$disconnect();
  }
}
