"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { MessageSquare } from "lucide-react";

const categories = [
  { value: "general", label: "Genel" },
  { value: "suggestion", label: "Oyun Önerisi" },
  { value: "bug", label: "Hata Bildirimi" },
  { value: "improvement", label: "İyileştirme" },
];

export default function FeedbackPage() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [category, setCategory] = useState("general");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  // Auto-fill email when user loads
  useState(() => {
    if (user?.email && !email) setEmail(user.email);
  });

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
        toast.success("Geri bildiriminiz alındı, teşekkürler!");
        setSent(true);
        setName("");
        setEmail(user?.email || "");
        setCategory("general");
        setMessage("");
      } else {
        const data = await res.json();
        toast.error(data.error || "Bir hata oluştu");
      }
    } catch {
      toast.error("Bağlantı hatası");
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
            <h1 className="text-2xl font-bold">Teşekkürler!</h1>
            <p className="text-[hsl(var(--muted-foreground))]">
              Geri bildiriminiz başarıyla gönderildi. En kısa sürede değerlendireceğiz.
            </p>
            <Button onClick={() => setSent(false)} variant="secondary">
              Yeni Geri Bildirim Gönder
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
          <h1 className="text-2xl font-bold">Geri Bildirim</h1>
          <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
            Görüşleriniz bizim için çok değerli. Oyunlar, öneriler veya hatalar hakkında bize yazın.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Honeypot — hidden from users */}
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
              Ad
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              placeholder="Adınız"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              E-posta
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              placeholder="ornek@email.com"
            />
          </div>

          <div>
            <label htmlFor="category" className="mb-1 block text-sm font-medium">
              Kategori
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
              Mesajınız
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
              placeholder="Düşüncelerinizi buraya yazın..."
            />
            <p className="mt-1 text-right text-xs text-[hsl(var(--muted-foreground))]">
              {message.length}/1000
            </p>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Gönderiliyor..." : "Gönder"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
