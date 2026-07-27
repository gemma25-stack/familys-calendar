"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { FamilyProvider } from "@/context/FamilyContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <FamilyProvider>{children}</FamilyProvider>
    </AuthProvider>
  );
}
