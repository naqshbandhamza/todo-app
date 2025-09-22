import { PrismaClient } from "@prisma/client";

declare global {
  // allow global caching in dev to avoid too many clients
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
