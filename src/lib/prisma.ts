import "server-only";

import { config } from "dotenv";
import { resolve } from "path";
import { PrismaClient } from "@prisma/client";

const dotenvOpts = { quiet: true as const };
config({ path: resolve(process.cwd(), ".env"), ...dotenvOpts });
config({ path: resolve(process.cwd(), ".env.local"), override: true, ...dotenvOpts });

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error(
      "DATABASE_URL 未設定。本機請在專案根目錄建立 .env 或 .env.local；Zeabur 請在「Next.js Web Service」環境變數新增 DATABASE_URL（與 PostgreSQL 連線字串相同，需含密碼與 ?sslmode=require）。勿使用 NEXT_PUBLIC_ 前綴。"
    );
  }
  return new PrismaClient({
    datasources: { db: { url } },
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });
}

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

/**
 * 延遲建立連線：避免在 import 階段就要求 DATABASE_URL（讓 Route 可先回 503）。
 * 透過 Proxy 維持與既有 `prisma.xxx` 相同的寫法。
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
