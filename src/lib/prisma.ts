import { PrismaClient } from "@prisma/client";

/**
 * Next.js dev 熱重載時避免重複 new PrismaClient（連線池耗盡）。
 * 僅在 Server（Route Handler、Server Component、Server Actions）使用，勿 import 進 client 元件。
 */
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
