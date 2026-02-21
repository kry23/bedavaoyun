import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const LOCALE_COOKIE = "preferred-locale";
const EN_DOMAIN = "freegames4you.online";

function isEnglishDomain(host: string): boolean {
  return host === EN_DOMAIN || host === `www.${EN_DOMAIN}`;
}

function getPreferredLocale(request: NextRequest): "tr" | "en" {
  // 1. English domain always means English
  const host = request.headers.get("host") || "";
  if (isEnglishDomain(host)) return "en";

  // 2. Check cookie (user already chose a language)
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie === "tr" || cookie === "en") return cookie;

  // 3. Check Accept-Language header
  const acceptLang = request.headers.get("accept-language") || "";
  if (acceptLang.includes("tr")) return "tr";

  // 4. Default to English for non-Turkish browsers
  return "en";
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const host = request.headers.get("host") || "";

  // English domain: redirect root to /en, redirect Turkish paths to English domain paths
  if (isEnglishDomain(host)) {
    // Root → /en
    if (pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/en";
      return NextResponse.redirect(url);
    }

    // Block Turkish-only paths on English domain → redirect to /en
    const turkishOnlyPaths = ["/oyunlar", "/siralama", "/giris", "/kayit", "/profil", "/blog"];
    if (turkishOnlyPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
      const url = request.nextUrl.clone();
      url.pathname = "/en";
      return NextResponse.redirect(url);
    }
  }

  // Turkish domain: auto-redirect "/" based on browser preference
  if (!isEnglishDomain(host) && pathname === "/") {
    const locale = getPreferredLocale(request);
    if (locale === "en") {
      // Redirect to English domain instead of /en path
      const enUrl = `https://${EN_DOMAIN}/en`;
      const response = NextResponse.redirect(enUrl);
      response.cookies.set(LOCALE_COOKIE, "en", { path: "/", maxAge: 60 * 60 * 24 * 365 });
      return response;
    }
  }

  // Set locale cookie when user explicitly visits a language path
  if (pathname.startsWith("/en")) {
    const response = await handleSupabase(request, pathname);
    response.cookies.set(LOCALE_COOKIE, "en", { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  // Turkish pages — set cookie so future visits stay Turkish
  const turkishPages = ["/oyunlar", "/siralama", "/giris", "/kayit", "/profil", "/blog"];
  if (turkishPages.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    const response = await handleSupabase(request, pathname);
    response.cookies.set(LOCALE_COOKIE, "tr", { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  return handleSupabase(request, pathname);
}

async function handleSupabase(request: NextRequest, pathname: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Turkish profile page requires auth
  if (!user && pathname.startsWith("/profil")) {
    const url = request.nextUrl.clone();
    url.pathname = "/giris";
    return NextResponse.redirect(url);
  }

  // English profile page requires auth
  if (!user && pathname.startsWith("/en/profile")) {
    const url = request.nextUrl.clone();
    url.pathname = "/en/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|mp3|wav)$|manifest\\.json|api/).*)",
  ],
};
