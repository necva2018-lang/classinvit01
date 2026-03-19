# ClassInvit01

招生型網站 + 後台 CMS（Courses / Cases / Media / Leads）。

## Tech Stack

- Next.js App Router + TypeScript
- Tailwind CSS + shadcn/ui
- Prisma + PostgreSQL（Zeabur 可用）
- localStorage fallback（API 不可用時）

## Local Development

1. 建立環境變數（請勿把真實密碼提交到 Git）：

```bash
cp .env.example .env
```

2. 安裝與初始化資料庫：

```bash
npm install
npm run db:push
npm run db:seed
```

3. 啟動：

```bash
npm run dev
```

## API Endpoints

- `GET/POST /api/courses`
- `GET/PATCH/DELETE /api/courses/:id`
- `GET/POST /api/cases`
- `GET/PATCH/DELETE /api/cases/:id`
- `GET/POST /api/media`
- `GET/PATCH/DELETE /api/media/:id`
- `GET/POST /api/leads`

## Zeabur Deployment (PostgreSQL)

1. 在 Zeabur 建立 PostgreSQL Service。
2. 在 Web Service 設定環境變數：
   - `DATABASE_URL=<your-postgresql-url>`
3. Build Command（建議）：

```bash
npm install && npm run prisma:generate && npm run db:push && npm run build
```

4. Start Command：

```bash
npm run start
```

5. 首次初始化資料（可在一次性 Job 或 Console 執行）：

```bash
npm run db:seed
```

## Notes

- 後台操作（建立/編輯/刪除/上架切換）會優先走 API + PostgreSQL。
- 若 API 異常，前端資料層會 fallback 到 localStorage，避免整站中斷。
