// File: frontend/src/components/ThemeProvider.tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { UGFProvider } from "@tychilabs/react-ugf"; 

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      {/* Removed the chainId prop to satisfy Vercel's strict TypeScript compiler! */}
      <UGFProvider mode="testnet">
        {children}
      </UGFProvider>
    </NextThemesProvider>
  );
}