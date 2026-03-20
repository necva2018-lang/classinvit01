import { NextResponse } from "next/server";

/** 與各 /api/* Route 共用，避免遺漏 DATABASE_URL 時難以排查 */
export const DATABASE_URL_MISSING_MESSAGE =
  "資料庫未設定：缺少 DATABASE_URL。請在 Zeabur 的 Next.js Web Service「環境變數」加入與 PostgreSQL 相同的連線字串（含使用者、密碼、?sslmode=require），勿使用 NEXT_PUBLIC_ 前綴。";

export function responseIfDatabaseUrlMissing(): NextResponse | null {
  if (!process.env.DATABASE_URL?.trim()) {
    return NextResponse.json(
      { error: DATABASE_URL_MISSING_MESSAGE },
      { status: 503 }
    );
  }
  return null;
}
