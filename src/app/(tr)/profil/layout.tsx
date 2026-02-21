import type { Metadata } from "next";
import { trAlternates } from "@/i18n/alternates";

export const metadata: Metadata = {
  title: "Profil",
  description: "Profilinizi görüntüleyin ve oyun istatistiklerinizi takip edin.",
  alternates: trAlternates("/profil", "/en/profile"),
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
