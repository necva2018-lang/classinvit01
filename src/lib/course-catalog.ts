import type { Course, CourseCategory, MediaItem } from "@/types";
import {
  COURSE_CATEGORY_MARKETING,
  COURSE_CATEGORY_ORDER,
} from "@/lib/course-categories";

export type CourseCategoryMarketingCopy =
  (typeof COURSE_CATEGORY_MARKETING)[CourseCategory];

export type PublishedCourseTabPanel = {
  category: CourseCategory;
  marketing: CourseCategoryMarketingCopy;
  courses: Course[];
};

export function courseMapById(courses: Course[]) {
  return new Map(courses.map((c) => [c.id, c] as const));
}

/** 已上架課程，依分類與 sortOrder 排序 */
export function publishedCoursesInCategory(
  courses: Course[],
  category: CourseCategory
): Course[] {
  return courses
    .filter((c) => c.isPublished && c.category === category)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

/** 首頁課程 Tabs：每個分類的文案與課程清單（資料層組裝，UI 只負責渲染） */
export function buildPublishedCourseTabPanels(
  courses: Course[]
): PublishedCourseTabPanel[] {
  return COURSE_CATEGORY_ORDER.map((category) => ({
    category,
    marketing: COURSE_CATEGORY_MARKETING[category],
    courses: publishedCoursesInCategory(courses, category),
  }));
}

/** 影音是否屬於某課程分類 Tab（explicit category 優先，否則依關聯課程） */
export function mediaMatchesCourseCategory(
  m: MediaItem,
  category: CourseCategory,
  courseById: Map<string, Course>
): boolean {
  if (m.category != null) {
    return m.category === category;
  }
  if (!m.relatedCourseId) return true;
  const c = courseById.get(m.relatedCourseId);
  return c?.category === category;
}

/**
 * 分類 Tab 影音：promo / course；無 category 且無關聯課程者為全分類通用（排前）。
 */
export function selectPromoMediaForCategory(
  media: MediaItem[],
  courseById: Map<string, Course>,
  category: CourseCategory,
  maxItems = 3
): MediaItem[] {
  const list = media
    .filter((m) => m.isPublished)
    .filter((m) => m.type === "promo" || m.type === "course")
    .filter((m) => mediaMatchesCourseCategory(m, category, courseById))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const isGlobal = (m: MediaItem) =>
    (m.category == null || m.category === undefined) && !m.relatedCourseId;
  const generic = list.filter(isGlobal);
  const rest = list.filter((m) => !isGlobal(m));
  return [...generic, ...rest].slice(0, maxItems);
}

/** 首頁精選宣傳影音 1–3 支（不含 hero，避免與首屏重複） */
export function selectSpotlightVideos(media: MediaItem[], limit = 3): MediaItem[] {
  return media
    .filter((m) => m.isPublished && m.type !== "hero")
    .filter((m) => m.type === "promo" || m.type === "course" || m.type === "case")
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, limit);
}
