import type { HeroContent } from "@/types";

/** 與改版前首頁 Hero 預設文案對齊，供首次載入或未發佈時顯示 */
export function createSeedHeroContent(): HeroContent {
  const now = new Date().toISOString();
  return {
    id: "hero_site_main",
    subtitle: "職業訓練 · 就業導向",
    title:
      "用可驗證的技能重返職場：補助、陪跑、作品集一次到位",
    description:
      "專為失業／待業、二度就業、轉職與第二專長設計。先釐清補助與學習路線，再用每週任務把焦慮變成進度——你不需先很厲害才開始。",
    badges: [
      "政府補助可諮詢",
      "免費諮詢零壓力",
      "零基礎可跟",
      "專業設備教室",
      "AI 工具應用",
    ],
    primaryCtaLabel: "免費預約｜確認補助與名額",
    primaryCtaTarget: "form",
    secondaryCtaLabel: "先看課程介紹影片",
    secondaryCtaTarget: "hero-video",
    heroImage: "",
    heroVideoUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    heroVideoThumbnail:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=80",
    showBadges: true,
    showSecondaryCta: true,
    showVideoPreview: true,
    isPublished: true,
    updatedAt: now,
  };
}
