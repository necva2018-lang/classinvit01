"use client";

import * as React from "react";

import { isPhoneLikelyValid } from "@/lib/lead-validation";
import * as leadsApi from "@/lib/leads";
import { track } from "@/components/landing/lead-form-actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

type LeadFormProps = {
  /** 課程方案區 CTA 帶入的課程名稱 */
  injectedCourseTitle?: string;
  /** 輸入框 placeholder 用的範例（例如首筆上架課程） */
  coursePlaceholderExample?: string;
};

export function LeadForm({
  injectedCourseTitle,
  coursePlaceholderExample,
}: LeadFormProps) {
  const { toast } = useToast();
  const [form, setForm] = React.useState({
    name: "",
    phone: "",
    course: "",
    contactTime: "平日白天",
  });
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (injectedCourseTitle?.trim()) {
      setForm((f) => ({ ...f, course: injectedCourseTitle.trim() }));
    }
  }, [injectedCourseTitle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = form.name.trim();
    const phone = form.phone.trim();
    const course = form.course.trim();
    const contactTime = form.contactTime.trim();

    track("form_submit", {
      course: course || coursePlaceholderExample || "",
      nameLen: name.length,
    });

    if (!name) {
      toast({
        title: "再一下就好",
        description: "請填寫姓名，我們才能安排專人聯繫。",
        variant: "destructive",
      });
      return;
    }
    if (!phone) {
      toast({
        title: "再一下就好",
        description: "請填寫手機，我們才能安排專人聯繫。",
        variant: "destructive",
      });
      return;
    }
    if (!isPhoneLikelyValid(phone)) {
      toast({
        title: "手機格式請再確認",
        description: "請輸入至少 8 位數字的手機號碼（可含 +886、空格或 -）。",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const result = await leadsApi.apiCreate({
      name,
      phone,
      course: course || undefined,
      contactTime: contactTime || undefined,
    });
    setSubmitting(false);

    if (!result.ok) {
      toast({
        title: "送出失敗",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    console.log("[track] lead_created", { id: result.lead.id });
    toast({
      title: "已成功送出",
      description:
        "感謝你的信任！我們將在 1 個工作天內與你聯繫，並協助確認補助與名額。",
    });
    setForm({
      name: "",
      phone: "",
      course: "",
      contactTime: "平日白天",
    });
  };

  return (
    <form className="space-y-5" onSubmit={(e) => void handleSubmit(e)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2 sm:col-span-1">
          <Label htmlFor="name" className="text-sm">
            姓名<span className="text-destructive">＊</span>
          </Label>
          <Input
            id="name"
            autoComplete="name"
            placeholder="例如：王小明"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="h-11"
            disabled={submitting}
          />
        </div>
        <div className="grid gap-2 sm:col-span-1">
          <Label htmlFor="phone" className="text-sm">
            手機<span className="text-destructive">＊</span>
          </Label>
          <Input
            id="phone"
            inputMode="tel"
            autoComplete="tel"
            placeholder="例如：0912-345-678"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="h-11"
            disabled={submitting}
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="course">想了解的課程（可選）</Label>
        <Input
          id="course"
          placeholder={
            coursePlaceholderExample
              ? `例如：${coursePlaceholderExample}`
              : "例如：前端就業班 / 資料分析班"
          }
          value={form.course}
          onChange={(e) => setForm((f) => ({ ...f, course: e.target.value }))}
          className="h-11"
          disabled={submitting}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="contactTime">方便聯繫時段（可選）</Label>
        <Input
          id="contactTime"
          placeholder="例如：平日晚上 7–9 點"
          value={form.contactTime}
          onChange={(e) =>
            setForm((f) => ({ ...f, contactTime: e.target.value }))
          }
          className="h-11"
          disabled={submitting}
        />
      </div>

      <Button
        className="h-12 w-full rounded-xl text-base font-semibold"
        type="submit"
        disabled={submitting}
      >
        {submitting ? "送出中…" : "送出｜安排免費諮詢（不綁約）"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        送出即表示你同意我們為聯繫諮詢使用你填寫的聯絡方式；隨時可要求停止使用。
      </p>
    </form>
  );
}
