/**
 * 純字串，可供 Client / Server 共用（勿在此 import next/server）。
 */

export const DATABASE_URL_ERROR_CODE = "DATABASE_URL_MISSING" as const;

/** API 503 JSON 的 `error` 欄位（精簡，避免被 UI 截成亂碼） */
export const DATABASE_URL_MISSING_API_ERROR =
  "伺服器未設定 DATABASE_URL。請在 Zeabur 的 Next.js Web Service 新增環境變數 DATABASE_URL，值與 PostgreSQL 連線字串相同（含密碼，結尾加 ?sslmode=require）。勿使用 NEXT_PUBLIC_ 前綴。";

/** 後台 toast 用：分行較易讀 */
export function databaseUrlMissingToastDescription(): string {
  return [
    "① 開啟 Zeabur → 選「Next.js / Web」那個服務（跑網站的那個），不是只選 PostgreSQL。",
    "② Environment Variables（環境變數）→ 新增 DATABASE_URL。",
    "③ 值請貼上 Postgres 的連線字串：要有使用者與密碼，並在結尾加上 ?sslmode=require。",
    "④ 儲存後重新部署；完成後再按一次 Hero「儲存」。",
    "（目前若顯示僅本機，代表內容只存在這台瀏覽器。）",
  ].join("\n");
}

export function isDatabaseUrlMissingError(
  message?: string,
  status?: number
): boolean {
  if (status === 503) return true;
  if (!message) return false;
  return (
    message.includes("DATABASE_URL") ||
    message.includes("NEXT_PUBLIC") ||
    message.includes("資料庫未設定") ||
    message.includes("伺服器未設定 DATABASE_URL")
  );
}
