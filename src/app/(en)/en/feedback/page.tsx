"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/i18n/useTranslation";
import { MessageSquare } from "lucide-react";

export default function FeedbackPage() {
  const { user } = useAuth();
  const t = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [category, setCategory] = useState("general");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useState(() => {
    if (user?.email && !email) setEmail(user.email);
  });

  const categories = [
    { value: "general", label: t.feedback.catGeneral },
    { value: "suggestion", label: t.feedback.catSuggestion },
    { value: "bug", label: t.feedback.catBug },
    { value: "improvement", label: t.feedback.catImprovement },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, category, message, website }),
      });

      if (res.ok) {
        toast.success(t.feedback.success);
        setSent(true);
        setName("");
        setEmail(user?.email || "");
        setCategory("general");
        setMessage("");
      } else {
        const data = await res.json();
        toast.error(data.error || t.feedback.error);
      }
    } catch {
      toast.error(t.feedback.error);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12">
        <Card>
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <MessageSquare className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold">{t.feedback.thankYou}</h1>
            <p className="text-[hsl(var(--muted-foreground))]">
              {t.feedback.successMessage}
            </p>
            <Button onClick={() => setSent(false)} variant="secondary">
              {t.feedback.sendAnother}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <Card>
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">{t.feedback.title}</h1>
          <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
            {t.feedback.description}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
          />

          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              {t.feedback.name}
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              placeholder={t.feedback.namePlaceholder}
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              {t.feedback.email}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              placeholder={t.feedback.emailPlaceholder}
            />
          </div>

          <div>
            <label htmlFor="category" className="mb-1 block text-sm font-medium">
              {t.feedback.category}
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="message" className="mb-1 block text-sm font-medium">
              {t.feedback.message}
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              minLength={10}
              maxLength={1000}
              rows={5}
              className="w-full resize-none rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              placeholder={t.feedback.messagePlaceholder}
            />
            <p className="mt-1 text-right text-xs text-[hsl(var(--muted-foreground))]">
              {message.length}/1000
            </p>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? t.feedback.sending : t.feedback.submit}
          </Button>
        </form>
      </Card>
    </div>
  );
}
