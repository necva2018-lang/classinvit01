/** 將常見影片連結轉成可內嵌播放的 URL（YouTube） */
export function getYoutubeEmbedUrl(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace("/", "");
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    return url;
  } catch {
    return url;
  }
}
