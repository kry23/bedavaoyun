"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useTranslation } from "@/i18n/useTranslation";

export default function EnglishLoginPage() {
  const router = useRouter();
  const t = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      toast.error(t.auth.supabaseNotConfigured);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success(t.auth.loginSuccess);
    router.push("/en");
    router.refresh();
  };

  return (
    <Card>
      <h1 className="mb-6 text-center text-2xl font-bold">
        {t.auth.loginTitle}
      </h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            {t.auth.email}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
            placeholder={t.auth.emailPlaceholder}
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            {t.auth.password}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
            placeholder="••••••••"
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? t.auth.loggingIn : t.auth.loginTitle}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-[hsl(var(--muted-foreground))]">
        {t.auth.noAccount}{" "}
        <Link href="/en/register" className="text-primary-600 hover:underline">
          {t.auth.registerTitle}
        </Link>
      </p>
    </Card>
  );
}
