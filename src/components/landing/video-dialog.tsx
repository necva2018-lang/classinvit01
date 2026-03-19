"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getYoutubeEmbedUrl } from "@/lib/video-embed";

export type VideoDialogPayload = {
  title: string;
  description: string;
  videoUrl: string;
} | null;

export function VideoDialog({
  open,
  onOpenChange,
  payload,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payload: VideoDialogPayload;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl overflow-hidden p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>{payload?.title ?? "播放影片"}</DialogTitle>
          <DialogDescription>{payload?.description ?? ""}</DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-black">
            <iframe
              key={open && payload?.videoUrl ? payload.videoUrl : "closed"}
              className="absolute inset-0 h-full w-full"
              src={
                open && payload?.videoUrl
                  ? getYoutubeEmbedUrl(payload.videoUrl)
                  : undefined
              }
              title={payload?.title ?? "video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
