import type { CourseCategory } from "@/types";

export const COURSE_CATEGORIES: CourseCategory[] = [
  "unemployed_subsidy",
  "employed_subsidy",
  "self_paid",
];

export const COURSE_CATEGORY_LABEL: Record<CourseCategory, string> = {
  unemployed_subsidy: "待業者補助",
  employed_subsidy: "在職課程",
  self_paid: "自費課程",
};

export const COURSE_CATEGORY_MARKETING: Record<
  CourseCategory,
  {
    tabTitle: string;
    tabSubtitle: string;
    listCtaLabel: string;
    cardPrimaryCtaLabel: string;
    cardSecondaryCtaLabel: string;
  }
> = {
  unemployed_subsidy: {
    tabTitle: "待業者補助課程",
    tabSubtitle: "優先協助你釐清資格、流程與開班梯次，再決定是否投入。",
    listCtaLabel: "免費預約｜先確認補助資格",
    cardPrimaryCtaLabel: "免費預約｜確認補助與名額",
    cardSecondaryCtaLabel: "先領補助評估表",
  },
  employed_subsidy: {
    tabTitle: "在職進修課程",
    tabSubtitle: "晚間/週末也能跟上，重點是可直接用在工作與升遷。",
    listCtaLabel: "免費預約｜幫我選在職方案",
    cardPrimaryCtaLabel: "預約諮詢｜安排在職時段",
    cardSecondaryCtaLabel: "先看課程大綱",
  },
  self_paid: {
    tabTitle: "自費加速課程",
    tabSubtitle: "想更快看到成果，用專案陪跑把技能變成作品與履歷亮點。",
    listCtaLabel: "免費預約｜規劃最短學習路線",
    cardPrimaryCtaLabel: "搶先預約｜保留諮詢優先序",
    cardSecondaryCtaLabel: "先看適合我的程度",
  },
};

export function getCourseCategoryLabel(category: CourseCategory) {
  return COURSE_CATEGORY_LABEL[category];
}

