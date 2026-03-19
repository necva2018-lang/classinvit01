import type { MediaItem } from "@/types";

export const seedMedia: MediaItem[] = [
  {
    id: "media_hero_001",
    title: "三分鐘了解：從零到可上工的學習路線",
    description: "用最短時間理解你會學到什麼、做到什麼、如何找到工作。",
    videoUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=80",
    type: "hero",
    category: null,
    isPublished: true,
    sortOrder: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "media_promo_001",
    title: "學員作品集成果精華",
    description: "真實作品集片段與上課氛圍。",
    videoUrl: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80",
    type: "promo",
    isPublished: true,
    sortOrder: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "media_course_web_001",
    title: "前端就業班｜你會做到哪些作品？",
    description: "用專案產出證明能力：從 RWD 到完整 Next.js 專題。",
    videoUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80",
    type: "course",
    category: "unemployed_subsidy",
    relatedCourseId: "course_web",
    isPublished: true,
    sortOrder: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "media_course_data_001",
    title: "資料分析班｜如何把報表變成面試亮點？",
    description: "從指標拆解到儀表板呈現，用故事說服面試官。",
    videoUrl: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
    type: "course",
    category: "employed_subsidy",
    relatedCourseId: "course_data",
    isPublished: true,
    sortOrder: 40,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "media_course_ai_001",
    title: "AI 辦公自動化｜示範：把重複工作變成 SOP",
    description: "用可直接套用的模板，讓 AI 成為每天用得到的能力。",
    videoUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=80",
    type: "course",
    category: "self_paid",
    relatedCourseId: "course_ai_office",
    isPublished: true,
    sortOrder: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

