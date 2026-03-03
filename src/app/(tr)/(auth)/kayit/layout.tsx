import type { Metadata } from "next";
import { trAlternates } from "@/i18n/alternates";

export const metadata: Metadata = {
  title: "Kayıt Ol",
  description: "Ücretsiz hesap oluşturun ve skorlarınızı kaydedin.",
  alternates: trAlternates("/kayit", "/en/register"),
  robots: { index: false, follow: false },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
