import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/admin", label: "總覽" },
  { href: "/admin/courses", label: "課程" },
  { href: "/admin/cases", label: "案例" },
  { href: "/admin/media", label: "影音" },
  { href: "/admin/leads", label: "名單" },
] as const;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30 dark:bg-background">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/90">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <Link
              href="/admin"
              className="flex shrink-0 items-center gap-2 rounded-xl outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <LayoutDashboard className="h-4 w-4" />
              </span>
              <span className="hidden text-sm font-semibold tracking-tight sm:inline">
                後台 CMS
              </span>
            </Link>
            <nav
              className="flex min-w-0 flex-1 gap-1 overflow-x-auto pb-0.5 [scrollbar-width:none] sm:flex-none sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden"
              aria-label="後台導覽"
            >
              {links.map((l) => (
                <Button
                  key={l.href}
                  variant="ghost"
                  size="sm"
                  className="h-9 shrink-0 px-2.5 sm:px-3"
                  asChild
                >
                  <Link href={l.href}>{l.label}</Link>
                </Button>
              ))}
            </nav>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              className="h-10 min-w-[4.5rem] rounded-xl sm:h-9"
              asChild
            >
              <Link href="/">回前台</Link>
            </Button>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
