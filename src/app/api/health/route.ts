import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * 快速檢查：不暴露 DATABASE_URL，僅回傳是否設定、Prisma 是否連得上。
 * 部署後可開 `GET /api/health` 確認 Zeabur Web Service 環境變數是否生效。
 */
export async function GET() {
  const databaseUrlConfigured = Boolean(process.env.DATABASE_URL?.trim());
  let databaseReachable = false;

  if (databaseUrlConfigured) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      databaseReachable = true;
    } catch {
      databaseReachable = false;
    }
  }

  return NextResponse.json({
    ok: true,
    databaseUrlConfigured,
    databaseReachable,
  });
}
