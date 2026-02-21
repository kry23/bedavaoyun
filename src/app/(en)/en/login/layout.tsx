import type { Metadata } from "next";
import { enAlternates } from "@/i18n/alternates";

export const metadata: Metadata = {
  title: "Login",
  description: "Log in to your account and save your scores.",
  alternates: enAlternates("/giris", "/en/login"),
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
