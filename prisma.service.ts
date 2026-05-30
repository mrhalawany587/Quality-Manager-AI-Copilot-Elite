import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
    } catch {
      console.warn('Database is unavailable; API started without an active Prisma connection.');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
