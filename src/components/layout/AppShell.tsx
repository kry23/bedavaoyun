import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { InstallBanner } from "@/components/pwa/InstallBanner";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import type { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

interface AppShellProps {
  locale: Locale;
  children: ReactNode;
}

export async function AppShell({ locale, children }: AppShellProps) {
  const dictionary = await getDictionary(locale);

  return (
    <body className={`${inter.className} antialiased`}>
      <GoogleAnalytics locale={locale} />
      <LocaleProvider locale={locale} dictionary={dictionary}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <InstallBanner />
          <ServiceWorkerRegister />
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </LocaleProvider>
    </body>
  );
}
