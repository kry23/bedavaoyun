import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const LOCALE_COOKIE = "preferred-locale";

function getPreferredLocale(request: NextRequest): "tr" | "en" {
  // 1. Check cookie (user already chose a language)
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie === "tr" || cookie === "en") return cookie;

  // 2. Check Accept-Language header
  const acceptLang = request.headers.get("accept-language") || "";
  // If Turkish is anywhere in the accept-language, stay Turkish
  if (acceptLang.includes("tr")) return "tr";

  // 3. Default to English for non-Turkish browsers
  return "en";
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Auto-redirect: if user hits root "/" and prefers English, redirect to /en
  if (pathname === "/") {
    const locale = getPreferredLocale(request);
    if (locale === "en") {
      const url = request.nextUrl.clone();
      url.pathname = "/en";
      const response = NextResponse.redirect(url);
      response.cookies.set(LOCALE_COOKIE, "en", { path: "/", maxAge: 60 * 60 * 24 * 365 });
      return response;
    }
  }

  // Set locale cookie when user explicitly visits a language path
  // This remembers their choice for future visits
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
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, icons, og images, manifest, etc.
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|mp3|wav)$|manifest\\.json|api/).*)",
  ],
};
