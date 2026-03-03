import type { Metadata } from "next";
import { trAlternates } from "@/i18n/alternates";

export const metadata: Metadata = {
  title: "Geri Bildirim",
  description: "Görüşlerinizi, önerilerinizi veya hata bildirimlerinizi bize iletin.",
  alternates: trAlternates("/geri-bildirim", "/en/feedback"),
};

export default function FeedbackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
