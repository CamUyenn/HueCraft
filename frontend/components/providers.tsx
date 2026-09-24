    "use client";

    import type { ReactNode } from "react";
    import { LanguageProvider } from "@/context/LanguageContext";
    import { ProgressProvider } from "@/context/ProgressContext";
    import { Toaster } from "sonner";

    export function AppProviders({ children }: { children: ReactNode }) {
      return (
        <LanguageProvider>
          <ProgressProvider>
            {children}
            <Toaster richColors position="top-center" />
          </ProgressProvider>
        </LanguageProvider>
      );
    }
