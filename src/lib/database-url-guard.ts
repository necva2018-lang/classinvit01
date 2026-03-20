import { NextResponse } from "next/server";

import {
  DATABASE_URL_ERROR_CODE,
  DATABASE_URL_MISSING_API_ERROR,
} from "@/lib/database-url-messages";

export function responseIfDatabaseUrlMissing(): NextResponse | null {
  if (!process.env.DATABASE_URL?.trim()) {
    return NextResponse.json(
      {
        error: DATABASE_URL_MISSING_API_ERROR,
        code: DATABASE_URL_ERROR_CODE,
      },
      { status: 503 }
    );
  }
  return null;
}
