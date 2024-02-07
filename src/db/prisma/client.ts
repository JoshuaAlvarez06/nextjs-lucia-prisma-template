import { env } from "@/env";
import { PrismaClient } from "@prisma/client";

class PrismaSingleton {
  client: any;

  constructor() {
    this.client = undefined;
  }

  getInstance(): PrismaClient {
    if (!this.client) this.client = new PrismaClient();
    if (env.NODE_ENV === "development") global.prisma = this.client;
    return this.client;
  }
}

declare global {
  var prisma: PrismaClient;
}

export const prisma = global.prisma || new PrismaSingleton().getInstance();
