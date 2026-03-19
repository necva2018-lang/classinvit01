import { scrollToLeadForm, track } from "@/components/landing/lead-form-actions";

/**
 * @param target `form` 或空字串 → 諮詢表單；`http` 開頭 → 新分頁；其餘 → `document.getElementById(target)` 平滑捲動
 */
export function runHeroCta(
  target: string,
  options: { label: string; placement: string }
) {
  const t = target.trim();
  const { label, placement } = options;

  if (!t || t === "form") {
    scrollToLeadForm(placement, label);
    return;
  }

  if (/^https?:\/\//i.test(t)) {
    track("cta_click", { placement, label, target: t });
    window.open(t, "_blank", "noopener,noreferrer");
    return;
  }

  track("cta_click", { placement, label, scrollTo: t });
  document.getElementById(t)?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}
