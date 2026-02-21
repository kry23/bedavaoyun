import type { Metadata } from "next";
import { enAlternates } from "@/i18n/alternates";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a free account and save your scores.",
  alternates: enAlternates("/kayit", "/en/register"),
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
