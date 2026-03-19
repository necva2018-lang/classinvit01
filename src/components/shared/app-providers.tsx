"use client";

import { ThemeProvider } from "@/components/shared/theme-provider";
import { ToastProviderClient } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="classinvit01-theme"
    >
      <ToastProviderClient>
        {children}
        <Toaster />
      </ToastProviderClient>
    </ThemeProvider>
  );
}
