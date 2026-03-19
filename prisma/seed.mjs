import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const now = new Date();

const seedCourses = [
  {
    id: "course_web",
    title: "前端網頁開發就業班",
    slug: "frontend-career",
    category: "unemployed_subsidy",
    subtitle: "12 週打造可面試作品集，從零到可上工",
    shortDescription:
      "適合轉職新手與二度就業者，以專案實作導向快速累積可用技能。",
    description:
      "從 UI/UX 基礎到 React/Next.js 專案實作，搭配履歷/面試演練與作品集指導。",
    audience: ["失業/待業者", "二度就業婦女", "想轉職者", "想學第二專長者"],
    highlights: ["作品集導向", "就業輔導", "小班陪跑"],
    contents: ["HTML/CSS", "JavaScript", "React", "Next.js", "求職作品集"],
    location: "台北市｜捷運 5 分鐘",
    schedule: "平日 09:30–16:30",
    subsidy: "可申請政府職訓補助（依資格審核）",
    fee: "符合資格補助後 0–10% 自付",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    ctaLabel: "立即預約免費諮詢",
    isPublished: true,
    sortOrder: 10,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "course_data",
    title: "資料分析職能培訓班",
    slug: "data-analyst-career",
    category: "employed_subsidy",
    subtitle: "用 Excel / SQL / BI 做出能上台報告的分析",
    shortDescription: "從商務問題到報表呈現，建立可轉職的分析職能。",
    description: "以職場情境練習：指標拆解、資料清理、SQL 查詢、視覺化儀表板與商務簡報。",
    audience: ["待業者", "想轉職者", "想學第二專長者"],
    highlights: ["真實情境題庫", "儀表板作品集", "職涯定位與履歷改寫"],
    contents: ["Excel/Google Sheets", "SQL 查詢", "BI 視覺化", "分析簡報與敘事"],
    location: "線上同步＋每週一次實體共學",
    schedule: "晚間 19:30–22:00",
    subsidy: "部分課程可申請補助（依梯次公告）",
    fee: "分期／早鳥方案",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
    ctaLabel: "看適合我的補助方案",
    isPublished: true,
    sortOrder: 20,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "course_ai_office",
    title: "AI 辦公效率與自動化實戰",
    slug: "ai-office-automation",
    category: "self_paid",
    subtitle: "用 AI 與自動化把每天的重複工作減半",
    shortDescription: "適合想學第二專長或提升職場效率的人。",
    description: "聚焦辦公情境：文件整理、摘要、簡報、資料清理與工作流自動化。",
    audience: ["在職者", "想學第二專長者", "想提升效率者"],
    highlights: ["情境模板可直接套用", "作業回饋與改寫", "不需要程式背景"],
    contents: ["AI 提示設計", "資料整理自動化", "簡報流程", "個人化 SOP"],
    location: "線上同步＋錄影回放",
    schedule: "週末班",
    subsidy: "此方案為自費課程，可搭配分期",
    fee: "自費｜可分期",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    ctaLabel: "免費諮詢課程適合度",
    isPublished: true,
    sortOrder: 30,
    createdAt: now,
    updatedAt: now,
  },
];

const seedCases = [
  {
    id: "case_001",
    name: "怡君",
    title: "育兒空窗後 3 個月拿到前端助理 offer",
    summary: "從零開始、每天 2 小時，建立作品集與面試自信。",
    beforeStatus: "二度就業、技能斷層、沒有作品可展示",
    afterStatus: "完成 2 個實作專題，成功轉職前端助理",
    quote: "助教陪跑讓我每週都有進度，面試也不再慌。",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    tags: ["二度就業", "作品集", "陪跑"],
    isFeatured: true,
    isPublished: true,
    sortOrder: 10,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "case_002",
    name: "志明",
    title: "失業後轉職資料分析，重新拿回掌控感",
    summary: "把過往經驗轉成可量化成果，作品集直接對齊職缺需求。",
    beforeStatus: "失業、方向不明、履歷沒有亮點",
    afterStatus: "完成儀表板作品集，成功轉職初階分析職",
    quote: "用情境題練到可以上台講故事，面試官很買單。",
    image:
      "https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=crop&w=1200&q=80",
    tags: ["失業者", "資料分析", "履歷"],
    isFeatured: true,
    isPublished: true,
    sortOrder: 20,
    createdAt: now,
    updatedAt: now,
  },
];

const seedMedia = [
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
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "media_promo_001",
    title: "學員作品集成果精華",
    description: "真實作品集片段與上課氛圍。",
    videoUrl: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80",
    type: "promo",
    category: null,
    isPublished: true,
    sortOrder: 20,
    createdAt: now,
    updatedAt: now,
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
    createdAt: now,
    updatedAt: now,
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
    createdAt: now,
    updatedAt: now,
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
    createdAt: now,
    updatedAt: now,
  },
];

async function main() {
  for (const course of seedCourses) {
    await prisma.course.upsert({
      where: { id: course.id },
      create: course,
      update: {
        title: course.title,
        slug: course.slug,
        category: course.category,
        subtitle: course.subtitle,
        shortDescription: course.shortDescription,
        description: course.description,
        audience: course.audience,
        highlights: course.highlights,
        contents: course.contents,
        location: course.location,
        schedule: course.schedule,
        subsidy: course.subsidy,
        fee: course.fee,
        image: course.image,
        videoUrl: course.videoUrl,
        ctaLabel: course.ctaLabel,
        isPublished: course.isPublished,
        sortOrder: course.sortOrder,
      },
    });
  }

  for (const item of seedCases) {
    await prisma.caseItem.upsert({
      where: { id: item.id },
      create: item,
      update: {
        name: item.name,
        title: item.title,
        summary: item.summary,
        beforeStatus: item.beforeStatus,
        afterStatus: item.afterStatus,
        quote: item.quote,
        image: item.image,
        videoUrl: item.videoUrl,
        tags: item.tags,
        isFeatured: item.isFeatured,
        isPublished: item.isPublished,
        sortOrder: item.sortOrder,
      },
    });
  }

  for (const media of seedMedia) {
    await prisma.mediaItem.upsert({
      where: { id: media.id },
      create: media,
      update: {
        title: media.title,
        description: media.description,
        videoUrl: media.videoUrl,
        thumbnailUrl: media.thumbnailUrl,
        type: media.type,
        category: media.category ?? null,
        relatedCourseId: media.relatedCourseId,
        relatedCaseId: media.relatedCaseId,
        isPublished: media.isPublished,
        sortOrder: media.sortOrder,
      },
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

