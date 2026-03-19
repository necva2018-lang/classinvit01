"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ScrollToFormButton,
  SectionCtaBar,
} from "@/components/landing/lead-form-actions";

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "我完全零基礎，真的跟得上嗎？",
    a: "可以。課程以每週可交付的小目標拆解，並搭配助教陪跑；你不需要先會寫程式或先很會工具，我們會先確認你的起點再安排節奏。",
  },
  {
    q: "補助怎麼申請？我符合嗎？",
    a: "補助資格會依政府規定與梯次有所不同。建議先預約免費諮詢，由顧問協助你做初步方向判讀與文件準備提醒；實際核定以主管機關審核為準。",
  },
  {
    q: "在職／育兒時間不固定，有彈性嗎？",
    a: "多數方案會提供晚間或週末時段選項（依梯次公告為準）。諮詢時可主動告知可上課時段，我們會協助對齊可行方案。",
  },
  {
    q: "上完課能幫助求職嗎？",
    a: "我們以就業與作品集為導向，會把履歷、作品敘事與面試表達納入學習節奏；重點是讓你能拿出「可被驗證」的成果。",
  },
  {
    q: "一定要當下報名嗎？",
    a: "不需要。諮詢的目的在於釐清方向與可行性；你可以帶走建議後再決定，不綁約、不強迫推銷。",
  },
];

export function FaqSection() {
  return (
    <section
      id="faq"
      className="scroll-mt-20 border-t border-border/40 bg-muted/15 py-10 dark:bg-muted/5 sm:py-14"
      aria-label="常見問題"
    >
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Understand
          </p>
          <h2 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
            常見問題
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            先把最常卡住的疑問講清楚，你更能專心評估「要不要踏出下一步」。
          </p>
        </div>

        <Accordion type="single" collapsible className="mt-8 w-full">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem key={item.q} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-sm sm:text-[15px]">
                {item.q}
              </AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-10">
          <SectionCtaBar
            title="還有你的個人情境想問？"
            subtitle="直接預約一對一諮詢，我們會用你能聽懂的方式，把路線、負荷與費用範圍說清楚。"
            primaryLabel="免費預約｜問我這種情況怎麼選"
            placementPrimary="faq_section"
          />
        </div>

        <div className="mt-4 sm:hidden">
          <ScrollToFormButton
            label="免費預約諮詢"
            placement="faq_footer_mobile"
            className="h-12 w-full rounded-xl text-base"
          />
        </div>
      </div>
    </section>
  );
}
