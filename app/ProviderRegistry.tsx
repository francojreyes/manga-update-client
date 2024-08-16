"use client";

import { extendTheme } from "@mui/joy";
import CssBaseline from "@mui/joy/CssBaseline";
import { CssVarsProvider } from "@mui/joy/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import React from "react";

const queryClient = new QueryClient();

export const theme = extendTheme();

export default function ProviderRegistry({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <CssVarsProvider defaultMode="dark" theme={theme}>
          <CssBaseline/>
          {children}
        </CssVarsProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
