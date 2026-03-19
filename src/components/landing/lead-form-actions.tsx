"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

export function track(event: string, payload?: Record<string, unknown>) {
  console.log(`[track] ${event}`, payload ?? {});
}

export function scrollToLeadForm(placement: string, label: string) {
  track("cta_click", { placement, label });
  document
    .getElementById("lead-form")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function ScrollToFormButton({
  className,
  label,
  placement,
  size = "lg",
  variant = "default",
}: {
  className?: string;
  label: string;
  placement: string;
  size?: React.ComponentProps<typeof Button>["size"];
  variant?: React.ComponentProps<typeof Button>["variant"];
}) {
  return (
    <Button
      className={className}
      size={size}
      variant={variant}
      onClick={() => scrollToLeadForm(placement, label)}
    >
      {label}
    </Button>
  );
}

export function SectionCtaBar({
  title,
  subtitle,
  primaryLabel,
  secondaryLabel,
  onSecondaryScrollTo,
  placementPrimary,
}: {
  title: string;
  subtitle: string;
  primaryLabel: string;
  secondaryLabel?: string;
  onSecondaryScrollTo?: string;
  placementPrimary: string;
}) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-primary/5 via-background to-background px-4 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 text-center sm:mx-0 sm:text-left">
        <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground sm:text-base">{subtitle}</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-3 md:justify-start">
          <ScrollToFormButton
            label={primaryLabel}
            placement={placementPrimary}
            className="h-12 rounded-xl text-base shadow-md"
          />
          {secondaryLabel && onSecondaryScrollTo ? (
            <Button
              variant="outline"
              size="lg"
              className="h-12 rounded-xl text-base"
              onClick={() => {
                track("cta_click", {
                  placement: `${placementPrimary}_secondary`,
                  label: secondaryLabel,
                });
                document
                  .getElementById(onSecondaryScrollTo)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {secondaryLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
