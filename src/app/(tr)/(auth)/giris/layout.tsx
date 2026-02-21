import type { Metadata } from "next";
import { trAlternates } from "@/i18n/alternates";

export const metadata: Metadata = {
  title: "Giriş Yap",
  description: "Hesabınıza giriş yapın ve skorlarınızı kaydedin.",
  alternates: trAlternates("/giris", "/en/login"),
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
