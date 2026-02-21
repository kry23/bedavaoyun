import type { Metadata } from "next";
import { enAlternates } from "@/i18n/alternates";

export const metadata: Metadata = {
  title: "Profile",
  description: "View your profile and track your game stats.",
  alternates: enAlternates("/profil", "/en/profile"),
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
