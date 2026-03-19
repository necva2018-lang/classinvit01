"use client";

import type { HeroContent, MediaItem } from "@/types";

import { HeroSection } from "@/components/landing/hero-section";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type HeroPreviewProps = {
  content: HeroContent;
  heroMediaFallback: MediaItem | null;
};

/** 後台即時預覽：版型接近首頁，包在可捲動區域內 */
export function HeroPreview({ content, heroMediaFallback }: HeroPreviewProps) {
  return (
    <Card className="overflow-hidden border-border/80 shadow-sm">
      <CardHeader className="space-y-1 border-b bg-muted/20 pb-4 dark:bg-muted/10">
        <CardTitle className="text-base">即時預覽</CardTitle>
        <CardDescription>
          以下畫面會隨左側／上方表單變動；與前台視覺大致相同（字級略縮小）。
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[min(72vh,560px)] overflow-y-auto p-0">
        <HeroSection
          content={content}
          heroMediaFallback={heroMediaFallback}
          embedded
        />
      </CardContent>
    </Card>
  );
}
