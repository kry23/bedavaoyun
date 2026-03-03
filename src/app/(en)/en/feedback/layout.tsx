import type { Metadata } from "next";
import { enAlternates } from "@/i18n/alternates";

export const metadata: Metadata = {
  title: "Feedback",
  description: "Share your thoughts, suggestions, or report issues to help us improve.",
  alternates: enAlternates("/geri-bildirim", "/en/feedback"),
};

export default function FeedbackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
