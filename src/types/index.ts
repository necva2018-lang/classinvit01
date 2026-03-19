export type ID = string;

export type MediaType = "hero" | "course" | "case" | "promo";

/** 與 Prisma `CourseCategory` enum、`COURSE_CATEGORY_ORDER` 保持一致 */
export type CourseCategory =
  | "unemployed_subsidy"
  | "employed_subsidy"
  | "self_paid";

export type Course = {
  id: ID;
  title: string;
  slug: string;
  category: CourseCategory;
  subtitle: string;
  shortDescription: string;
  description: string;
  audience: string[];
  highlights: string[];
  contents: string[];
  location: string;
  schedule: string;
  subsidy: string;
  fee: string;
  image: string;
  videoUrl: string;
  ctaLabel: string;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type CaseItem = {
  id: ID;
  name: string;
  title: string;
  summary: string;
  beforeStatus: string;
  afterStatus: string;
  quote: string;
  image: string;
  videoUrl?: string;
  tags: string[];
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type MediaItem = {
  id: ID;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  type: MediaType;
  /** 首頁分類影音用；未設定時由關聯課程推斷 */
  category?: CourseCategory | null;
  relatedCourseId?: ID;
  relatedCaseId?: ID;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type Lead = {
  id: ID;
  name: string;
  phone: string;
  course: string;
  contactTime: string;
  createdAt: string;
};

