import type { CaseItem } from "@/types";

/** 首頁精選案例：已上架且精選，依 sortOrder */
export function selectLandingFeaturedCases(cases: CaseItem[]): CaseItem[] {
  return cases
    .filter((c) => c.isPublished && c.isFeatured)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
