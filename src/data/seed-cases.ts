import type { CaseItem } from "@/types";

export const seedCases: CaseItem[] = [
  {
    id: "case_001",
    name: "怡君",
    title: "育兒空窗後 3 個月拿到前端助理 offer",
    summary: "從零開始、每天 2 小時，建立作品集與面試自信。",
    beforeStatus: "二度就業、技能斷層、沒有作品可展示",
    afterStatus: "完成 2 個實作專題，成功轉職前端助理",
    quote:
      "我最怕學到一半就放棄，助教陪跑讓我每週都有進度，面試也不再慌。",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    tags: ["二度就業", "作品集", "陪跑"],
    isFeatured: true,
    isPublished: true,
    sortOrder: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "case_002",
    name: "志明",
    title: "失業後轉職資料分析，重新拿回掌控感",
    summary: "把過往經驗轉成可量化成果，作品集直接對齊職缺需求。",
    beforeStatus: "失業、方向不明、履歷沒有亮點",
    afterStatus: "完成儀表板作品集，成功轉職初階分析職",
    quote:
      "以前覺得資料分析很難，結果用情境題練到可以上台講故事，面試官很買單。",
    image:
      "https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=crop&w=1200&q=80",
    tags: ["失業者", "資料分析", "履歷"],
    isFeatured: true,
    isPublished: true,
    sortOrder: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "case_003",
    name: "小萱",
    title: "從行政轉職設計助理，找到更適合的跑道",
    summary: "用清楚的學習路線把焦慮變成行動。",
    beforeStatus: "待業、焦慮、一直找不到適合方向",
    afterStatus: "完成作品集與模擬專案，拿到設計助理 offer",
    quote: "最有用的是每個階段都知道要產出什麼，不會迷路。",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
    tags: ["待業者", "作品集", "轉職"],
    isFeatured: false,
    isPublished: true,
    sortOrder: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

