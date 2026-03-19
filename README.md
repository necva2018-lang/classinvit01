# ClassInvit01

招生型網站 + 後台 CMS（Courses / Cases / Media / Leads）。

## Tech Stack

- Next.js App Router + TypeScript
- Tailwind CSS + shadcn/ui
- Prisma + PostgreSQL（Zeabur 可用）
- **Leads 名單**：僅 PostgreSQL（無 localStorage 備援）
- 其餘模組（課程／案例／影音等）仍可有 localStorage 備援

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

## 首頁 Hero（後台）

- 後台路徑：`/admin/hero`（單筆編輯 + 即時預覽）。
- 資料儲存：**優先 PostgreSQL**（`SiteHero` 單列，`id = site`）；API 失敗時後台會改存 **localStorage**（`cms:hero_content:v1`）作備援。
- 未發佈（`isPublished = false`）時，前台訪客仍看到內建預設文案。
- 部署後請執行 `npm run db:push`（或 migrate）並 `npm run db:seed` 寫入預設 Hero。
- 跨分頁／備援：前台仍會監聽 `storage`；使用資料庫時請重新整理首頁以載入最新內容。

## API Endpoints

- `GET /api/hero`、`PUT /api/hero` 或 `POST /api/hero`（內容相同；部分環境若 PUT 被擋可改用 POST）
- `GET/POST /api/courses`
- `GET/PATCH/DELETE /api/courses/:id`
- `GET/POST /api/cases`
- `GET/PATCH/DELETE /api/cases/:id`
- `GET/POST /api/media`
- `GET/PATCH/DELETE /api/media/:id`
- `GET /api/leads?q=&course=`、`POST /api/leads`（名單僅 PostgreSQL）

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

### Zeabur 更新／重新部署流程（紀錄）

以下為實際用過、可重複的操作模式；Zeabur 專案需已**綁定 GitHub** `necva2018-lang/classinvit01`（或你的 fork）並開啟自動部署。

| 模式 | 時機 | 作法 |
|------|------|------|
| **A. 一般更新** | 程式有變更要上線 | 本機 `git add` → `git commit` → `git push origin main`。推送後 Zeabur 自動拉取並建置。 |
| **B. 觸發重建（無程式差異）** | 雲端快取／想強制再跑一輪 build，但不想改程式 | 空 commit 推上去：`git commit --allow-empty -m "chore: trigger Zeabur redeploy"` → `git push origin main`。 |
| **C. 控制台手動** | 自動部署未觸發或需立即重跑 | 登入 [Zeabur Dashboard](https://dash.zeabur.com) → 選專案 → **Web Service** → 使用 **Redeploy／重新部署**（依介面文案為準）。 |

**本次（文件撰寫時）採用模式**：先完成一般功能 commit 推送（`feat: …`），再追加 **模式 B** 空 commit（`chore: trigger Zeabur redeploy`）以確保 Zeabur 開始新一輪建置。

**部署後請自行確認**（本機無法代查 Zeabur）：

1. 該次 **Deployment** 狀態為成功；失敗時查看 **Build Logs**。
2. Schema 有變更時，Build Command 須含 `npm run db:push`（見上），否則執行期可能因缺欄位錯誤。
3. 新環境或要重灌示範資料：在服務 **Console** 執行 `npm run db:seed`（注意會寫入／更新種子資料，依需求執行）。

**備註**：`package.json` 的 `postinstall` 已含 `prisma generate`；若 Zeabur Build 指令與 README 建議一致，會在安裝依賴後自動產生 Prisma Client。

## Notes

- **Leads**：前台表單與後台 `/admin/leads` 僅透過 Prisma + `DATABASE_URL` 存取；請勿將 `DATABASE_URL` 加上 `NEXT_PUBLIC_` 前綴。
- 課程／案例／影音／後台操作仍可能優先 API + PostgreSQL，API 異常時部分模組會 fallback localStorage（Leads 除外）。
