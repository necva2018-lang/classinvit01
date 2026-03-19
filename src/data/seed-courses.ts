import type { Course } from "@/types";

export const seedCourses: Course[] = [
  {
    id: "course_web",
    title: "前端網頁開發就業班",
    slug: "frontend-career",
    category: "unemployed_subsidy",
    subtitle: "12 週打造可面試作品集，從零到可上工",
    shortDescription:
      "適合轉職新手與二度就業者，以專案實作導向快速累積可用技能。",
    description:
      "從 UI/UX 基礎到 React/Next.js 專案實作，搭配履歷/面試演練與作品集指導。課程包含每週專題、助教陪跑與求職策略，讓你在有限時間內完成可投遞的作品與自信。",
    audience: ["失業/待業者", "二度就業婦女", "想轉職者", "想學第二專長者"],
    highlights: [
      "作品集導向：每週都產出可展示成果",
      "就業輔導：履歷、面試、職涯定位一次到位",
      "小班陪跑：卡關即時協助，降低中途放棄",
    ],
    contents: [
      "HTML/CSS 與 RWD 版型實作",
      "JavaScript 與程式思維",
      "React 元件化與狀態管理",
      "Next.js App Router 專案與部署",
      "求職作品集整合與面試演練",
    ],
    location: "台北市｜捷運 5 分鐘",
    schedule: "平日 09:30–16:30（可申請補助）",
    subsidy: "可申請政府職訓補助（依資格審核）",
    fee: "符合資格補助後 0–10% 自付",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    ctaLabel: "立即預約免費諮詢",
    isPublished: true,
    sortOrder: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "course_data",
    title: "資料分析職能培訓班",
    slug: "data-analyst-career",
    category: "employed_subsidy",
    subtitle: "用 Excel / SQL / BI 做出能上台報告的分析",
    shortDescription: "從商務問題到報表呈現，建立可轉職的分析職能。",
    description:
      "以職場情境練習：指標拆解、資料清理、SQL 查詢、視覺化儀表板與商務簡報。適合想轉職、升職或學第二專長的人。",
    audience: ["待業者", "想轉職者", "想學第二專長者"],
    highlights: ["真實情境題庫", "儀表板作品集", "職涯定位與履歷改寫"],
    contents: ["Excel/Google Sheets", "SQL 查詢", "BI 視覺化", "分析簡報與敘事"],
    location: "線上同步＋每週一次實體共學",
    schedule: "晚間 19:30–22:00（適合在職/育兒）",
    subsidy: "部分課程可申請補助（依梯次公告）",
    fee: "分期／早鳥方案（可諮詢適用）",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
    ctaLabel: "看適合我的補助方案",
    isPublished: true,
    sortOrder: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "course_ai_office",
    title: "AI 辦公效率與自動化實戰",
    slug: "ai-office-automation",
    category: "self_paid",
    subtitle: "用 AI 與自動化把每天的重複工作減半",
    shortDescription:
      "適合想學第二專長或提升職場效率的人，以可立即套用的情境專案為主。",
    description:
      "聚焦辦公情境：文件整理、摘要、簡報、資料清理與工作流自動化。用可落地的模板與練習，讓你把 AI 工具變成每天用得到的能力。",
    audience: ["在職者", "想學第二專長者", "想提升效率者"],
    highlights: ["情境模板可直接套用", "作業回饋與改寫", "不需要程式背景也能開始"],
    contents: [
      "常見辦公情境的 AI 提示設計",
      "資料整理與重複工作自動化",
      "簡報與內容產出工作流",
      "個人化 SOP 與範本建立",
    ],
    location: "線上同步＋錄影回放",
    schedule: "週末班（不影響上班）",
    subsidy: "此方案為自費課程，可搭配分期",
    fee: "自費｜可分期",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    ctaLabel: "免費諮詢課程適合度",
    isPublished: true,
    sortOrder: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

