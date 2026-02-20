# 🎮 Bedava Oyun — Final Project Spec

**Domain:** bedava-oyun.com
**Proje Adı (kod):** bedava-oyun
**Görünen Ad:** Bedava Oyun
**Dil:** Sadece Türkçe (İngilizce desteği v2'de)

---

## Teknoloji Kararları ve Gerekçeler

| Karar | Seçim | Gerekçe |
|-------|-------|---------|
| Framework | Next.js 14+ (App Router) | SSG + API Routes tek projede, Vercel ücretsiz deploy |
| Veritabanı | Supabase PostgreSQL | 500MB free, yönetilen, RLS güvenliği |
| Auth | Supabase Auth | Sıfır auth kodu, email + OAuth hazır |
| DB erişimi | Supabase JS client doğrudan | Drizzle/ORM gereksiz — Supabase zaten type-safe query builder sunuyor, edge/runtime sorunları yok, 3 bağımlılık daha az |
| Styling | Tailwind CSS v3.4.x | v4 hâlâ breaking change riski taşıyor, v3.4 stabil ve kaynak bol |
| Tema | next-themes | 1KB, zero-flash dark mode |
| State yönetimi | Yok (ihtiyaç olursa Zustand sonra eklenir) | Auth → Supabase hook, tema → next-themes, oyun → useRef. Global state ihtiyacı yok |
| i18n | Yok (v2'de) | Domain Türkçe, hedef kitle Türk, MVP'de gereksiz karmaşıklık |
| Oyun render | HTML5 Canvas + useRef | React re-render sıfır, 60fps oyun loop |
| API Runtime | Node.js (serverless) | Edge runtime DB driver sorunları yok, Vercel free'de çalışır |
| Başarım sistemi | Yok (v2'de) | MVP'de auth + skor + liderlik yeterli |

---

## MVP Kapsamı (v1)

### 4 Oyun (tarayıcıda oynanabilir)
1. **Mayın Tarlası** — Klasik, iyi bilinen (Easy 9×9, Medium 16×16, Hard 30×16)
2. **2048** — Basit engine, çok popüler
3. **Yılan** — En basit engine, hızlı geliştirme
4. **Kelime Tahmin (Wordle)** — Günlük oynanabilirlik, kullanıcı geri dönüşü

### v2'de Eklenecekler (kullanıcı geri bildirimine göre)
- Sudoku (generator karmaşık)
- Tetris (SRS rotation + wall kick karmaşık)
- XOX (Minimax AI)
- Hafıza Oyunu
- Nonogram (solver karmaşık)
- Işıkları Söndür

### Kullanıcı Sistemi
- Kayıt / Giriş (Supabase Auth — email + şifre)
- Google OAuth (opsiyonel, Supabase'de 1 tık ile aktif)
- Profil sayfası (kullanıcı adı, avatar, istatistikler)
- **Misafir oyun desteği** — kayıt olmadan oyna, skor kaydetmek için giriş

### Liderlik Tablosu
- Her oyun + zorluk için ayrı tablo
- Günlük / Haftalık / Tüm zamanlar filtreleri
- Kişisel istatistikler: toplam oyun, kazanma oranı, en iyi skor

### Misafir Akışı (ÖNEMLİ)
```
Kullanıcı siteye gelir → Oyun seçer → Hemen oynar (auth yok)
→ Oyun biter → "Skorunu kaydet ve sıralamaya gir — Giriş Yap"
→ Kayıt/giriş → Skor kaydedilir → Liderlik tablosunda görünür
```
Bu akış bounce rate'i düşürür. Auth duvarı oyun öncesinde OLMAMALI.

---

## Proje Yapısı

```
bedava-oyun/
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout (html, body, ThemeProvider, Navbar, Footer)
│   │   ├── page.tsx                  # Ana sayfa (SSG — oyun kartları grid)
│   │   ├── globals.css               # Tailwind base + custom styles
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   │
│   │   ├── (auth)/
│   │   │   ├── giris/page.tsx        # Login
│   │   │   ├── kayit/page.tsx        # Register
│   │   │   └── layout.tsx            # Centered card layout
│   │   │
│   │   ├── oyunlar/
│   │   │   ├── page.tsx              # Tüm oyunlar listesi (SSG)
│   │   │   └── [slug]/
│   │   │       ├── page.tsx          # Oyun sayfası (SSG shell + client game)
│   │   │       └── loading.tsx
│   │   │
│   │   ├── siralama/
│   │   │   ├── page.tsx              # Genel liderlik (ISR — 60sn)
│   │   │   └── [gameSlug]/page.tsx   # Oyun bazlı liderlik
│   │   │
│   │   ├── profil/
│   │   │   ├── page.tsx              # Kendi profil (auth gerekli)
│   │   │   └── [userId]/page.tsx     # Başka kullanıcı
│   │   │
│   │   └── api/
│   │       ├── scores/route.ts       # POST skor, GET skorlar
│   │       └── leaderboard/
│   │           └── [gameSlug]/route.ts
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MobileNav.tsx         # Hamburger menü
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── game/
│   │   │   ├── GameShell.tsx         # Ortak wrapper: timer, skor, zorluk, responsive canvas
│   │   │   ├── GameCard.tsx          # Ana sayfadaki oyun kartı
│   │   │   ├── GameOverModal.tsx     # Kazanma/kaybetme + skor kaydet CTA
│   │   │   └── TouchControls.tsx     # Mobil swipe/tap overlay
│   │   ├── leaderboard/
│   │   │   ├── LeaderboardTable.tsx
│   │   │   └── RankBadge.tsx
│   │   └── profile/
│   │       └── StatsGrid.tsx
│   │
│   ├── games/                        # Oyun engine'leri (pure TS — React bağımsız)
│   │   ├── minesweeper/
│   │   │   ├── MinesweeperGame.tsx   # React wrapper (Canvas ref + UI)
│   │   │   ├── engine.ts            # Saf oyun mantığı
│   │   │   ├── renderer.ts          # Canvas çizim
│   │   │   └── types.ts
│   │   ├── game2048/
│   │   │   ├── Game2048.tsx
│   │   │   ├── engine.ts
│   │   │   ├── renderer.ts
│   │   │   └── types.ts
│   │   ├── snake/
│   │   │   ├── SnakeGame.tsx
│   │   │   ├── engine.ts
│   │   │   ├── renderer.ts
│   │   │   └── types.ts
│   │   └── wordle/
│   │       ├── WordleGame.tsx
│   │       ├── engine.ts
│   │       ├── words.ts              # Türkçe 5 harfli kelime listesi
│   │       └── types.ts
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts            # Browser client (createBrowserClient)
│   │   │   └── server.ts            # Server client (createServerClient)
│   │   ├── game-registry.ts         # Oyun metadata (slug, ad, açıklama, ikon)
│   │   ├── score-validator.ts       # Anti-cheat doğrulama
│   │   └── sounds.ts               # Web Audio API helper
│   │
│   ├── hooks/
│   │   ├── useAuth.ts               # Supabase auth state hook
│   │   ├── useGameTimer.ts          # Zamanlayıcı (start/stop/reset)
│   │   └── useKeyboard.ts          # Klavye input
│   │
│   ├── utils/
│   │   ├── cn.ts                    # clsx + twMerge
│   │   └── constants.ts
│   │
│   └── types/
│       ├── game.ts
│       └── database.ts              # Supabase generated types
│
├── public/
│   ├── icons/                        # Oyun ikonları (SVG) + PWA ikonları
│   ├── sounds/                       # Ses efektleri (~30KB toplam)
│   │   ├── click.mp3
│   │   ├── win.mp3
│   │   ├── lose.mp3
│   │   └── flag.mp3
│   ├── manifest.json                 # PWA manifest
│   └── og/                           # OpenGraph görselleri (her oyun için)
│
├── middleware.ts                      # Auth redirect (sadece /profil koruması)
├── next.config.ts
├── tailwind.config.ts                # Tailwind v3.4 config
├── postcss.config.mjs
├── tsconfig.json
├── .env.local.example
└── package.json
```

---

## Veritabanı (Supabase SQL Editor'da çalıştırılır)

```sql
-- 1. Profiller (Supabase Auth ile senkronize)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Auth trigger: yeni kullanıcı → otomatik profil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || LEFT(NEW.id::text, 8)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Skorlar
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  game_slug TEXT NOT NULL,
  score INTEGER NOT NULL,
  difficulty TEXT,
  moves INTEGER,
  duration INTEGER,
  won BOOLEAN DEFAULT TRUE NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_scores_game_score ON scores(game_slug, score DESC);
CREATE INDEX idx_scores_game_duration ON scores(game_slug, duration ASC);
CREATE INDEX idx_scores_user_game ON scores(user_id, game_slug);
CREATE INDEX idx_scores_created ON scores(created_at DESC);

-- 3. RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes profilleri görebilir"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Kullanıcı kendi profilini düzenleyebilir"
  ON profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes skorları görebilir"
  ON scores FOR SELECT USING (true);

CREATE POLICY "Giriş yapanlar kendi skorunu ekleyebilir"
  ON scores FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

## Supabase Client Kullanımı

```typescript
// src/lib/supabase/client.ts — Browser (client component'ler)
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

```typescript
// src/lib/supabase/server.ts — Server (API routes, server components)
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

export function createClient() {
  const cookieStore = cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

```bash
# TypeScript tipleri otomatik üretimi
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
```

---

## API Routes

```typescript
// src/app/api/scores/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validateScore } from '@/lib/score-validator';

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Giriş yapmalısınız' }, { status: 401 });

  const body = await req.json();
  const { gameSlug, score, difficulty, duration, moves, won, metadata } = body;

  const validation = validateScore({ gameSlug, score, difficulty, duration, moves });
  if (!validation.valid) {
    return NextResponse.json({ error: validation.reason }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('scores')
    .insert({ user_id: user.id, game_slug: gameSlug, score, difficulty, duration, moves, won, metadata })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
```

```typescript
// src/app/api/leaderboard/[gameSlug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest, { params }: { params: { gameSlug: string } }) {
  const supabase = createClient();
  const { searchParams } = new URL(req.url);
  const period = searchParams.get('period') || 'all';
  const difficulty = searchParams.get('difficulty');
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

  let query = supabase
    .from('scores')
    .select('*, profiles(username, avatar)')
    .eq('game_slug', params.gameSlug)
    .eq('won', true)
    .order('score', { ascending: false })
    .limit(limit);

  if (difficulty) query = query.eq('difficulty', difficulty);

  if (period === 'daily') {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    query = query.gte('created_at', today.toISOString());
  } else if (period === 'weekly') {
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    query = query.gte('created_at', weekAgo.toISOString());
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  });
}
```

---

## Oyun Engine Mimarisi

3 katman: Engine (pure logic) → Renderer (Canvas) → React Component (UI shell)

```typescript
// DOĞRU Canvas pattern — useRef, sıfır re-render
'use client';
export default function MinesweeperGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef(createGame(9, 9, 10));
  const [uiState, setUiState] = useState({ score: 0, status: 'idle' as GameStatus });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    // Responsive canvas
    const resize = () => {
      const size = Math.min(canvas.parentElement!.clientWidth, 600);
      canvas.width = size;
      canvas.height = size;
      renderBoard(ctx, stateRef.current);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    // ... click → engine update → canvas render
    // React state SADECE oyun bittiğinde güncellenir (modal göstermek için)
    if (stateRef.current.status !== 'playing') {
      setUiState({ score: stateRef.current.score, status: stateRef.current.status });
    }
  }, []);

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} onClick={handleClick} className="touch-none max-w-full" />
      {uiState.status === 'won' && <GameOverModal won score={uiState.score} />}
      {uiState.status === 'lost' && <GameOverModal won={false} score={uiState.score} />}
    </div>
  );
}
```

### Mobil Touch (Faz 1'de — baştan)

```typescript
// src/hooks/useSwipe.ts
export function useSwipe(onSwipe: (dir: 'up' | 'down' | 'left' | 'right') => void) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30)
        onSwipe(dx > 0 ? 'right' : 'left');
      else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 30)
        onSwipe(dy > 0 ? 'down' : 'up');
      touchStart.current = null;
    };
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchend', onTouchEnd);
    return () => { window.removeEventListener('touchstart', onTouchStart); window.removeEventListener('touchend', onTouchEnd); };
  }, [onSwipe]);
}
```

---

## Oyun Detayları

### 1. Mayın Tarlası
- **Zorluklar:** Easy (9×9, 10 mayın), Medium (16×16, 40 mayın), Hard (30×16, 99 mayın)
- **Masaüstü:** Sol tık = aç, Sağ tık = bayrak
- **Mobil:** Tap = aç, Long press = bayrak
- **Skor:** Tamamlama süresi (düşük = iyi). İlk tıkta mayın patlamaz.

### 2. 2048
- **Grid:** 4×4
- **Masaüstü:** Arrow keys
- **Mobil:** Swipe (baştan implemente)
- **Skor:** Toplanan puan

### 3. Yılan
- **Grid:** 20×20 (responsive)
- **Masaüstü:** Arrow keys / WASD
- **Mobil:** Swipe
- **Skor:** Yenen yem sayısı. Her 5 yemde hız artar.

### 4. Kelime Tahmin (Wordle)
- **Kurallar:** 6 tahmin, 5 harfli Türkçe kelime
- **Günlük mod:** Tarih bazlı seed — herkes aynı kelimeyi çözer
- **Klavye:** Ekran klavyesi (masaüstü + mobil), kullanılmış harfler renkli
- **Skor:** Tahmin sayısı (1-6, düşük = iyi)

---

## Anti-Cheat

```typescript
// src/lib/score-validator.ts
const RULES: Record<string, (input: ScoreInput) => { valid: boolean; reason?: string }> = {
  minesweeper: ({ difficulty, duration }) => {
    const minTimes: Record<string, number> = { easy: 3000, medium: 15000, hard: 30000 };
    if (duration && duration < (minTimes[difficulty || 'easy'] || 3000))
      return { valid: false, reason: 'Süre gerçekçi değil' };
    return { valid: true };
  },
  game2048: ({ score }) => {
    if (score > 500000) return { valid: false, reason: 'Skor gerçekçi değil' };
    return { valid: true };
  },
  snake: ({ score }) => {
    if (score > 500) return { valid: false, reason: 'Maksimum skor aşıldı' };
    return { valid: true };
  },
  wordle: ({ score }) => {
    if (score < 1 || score > 6) return { valid: false, reason: 'Tahmin 1-6 arası olmalı' };
    return { valid: true };
  },
};

export function validateScore(input: ScoreInput): { valid: boolean; reason?: string } {
  const rule = RULES[input.gameSlug];
  if (!rule) return { valid: false, reason: 'Bilinmeyen oyun' };
  return rule(input);
}
```

---

## SEO (Faz 1'den itibaren)

```typescript
// src/app/oyunlar/[slug]/page.tsx
import type { Metadata } from 'next';
import { gameRegistry } from '@/lib/game-registry';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const game = gameRegistry[params.slug];
  return {
    title: `${game.name} - Ücretsiz Online Oyna | Bedava Oyun`,
    description: `${game.name} oyununu tarayıcında ücretsiz oyna. ${game.description}`,
    openGraph: {
      title: `${game.name} | Bedava Oyun`,
      description: game.description,
      images: [`/og/${params.slug}.png`],
      url: `https://bedava-oyun.com/oyunlar/${params.slug}`,
    },
  };
}

export function generateStaticParams() {
  return Object.keys(gameRegistry).map((slug) => ({ slug }));
}
```

```typescript
// src/lib/game-registry.ts
export const gameRegistry: Record<string, {
  name: string; slug: string; description: string; icon: string; color: string;
}> = {
  minesweeper: { name: 'Mayın Tarlası', slug: 'minesweeper', description: 'Gizli mayınları bul, tarlayı temizle!', icon: '💣', color: '#EF4444' },
  game2048:    { name: '2048', slug: 'game2048', description: 'Sayıları kaydır, birleştir ve 2048\'e ulaş!', icon: '🔢', color: '#F59E0B' },
  snake:       { name: 'Yılan', slug: 'snake', description: 'Yemleri ye, büyü ama kuyruğuna çarpma!', icon: '🐍', color: '#10B981' },
  wordle:      { name: 'Kelime Tahmin', slug: 'wordle', description: '6 hakta 5 harfli Türkçe kelimeyi bul!', icon: '📝', color: '#6366F1' },
};
```

---

## PWA

```json
// public/manifest.json
{
  "name": "Bedava Oyun",
  "short_name": "Bedava Oyun",
  "description": "Tarayıcıda ücretsiz bulmaca ve klasik oyunlar",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0F172A",
  "theme_color": "#6366F1",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

---

## Ses Efektleri

```typescript
// src/lib/sounds.ts
const sounds: Record<string, HTMLAudioElement> = {};

export function preloadSounds() {
  ['click', 'win', 'lose', 'flag'].forEach((name) => {
    const audio = new Audio(`/sounds/${name}.mp3`);
    audio.preload = 'auto';
    audio.volume = 0.3;
    sounds[name] = audio;
  });
}

export function playSound(name: string) {
  const s = sounds[name];
  if (s) { s.currentTime = 0; s.play().catch(() => {}); }
}
```

---

## Tailwind v3.4 Config

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { 50: '#EEF2FF', 100: '#E0E7FF', 500: '#6366F1', 600: '#4F46E5', 700: '#4338CA' },
      },
    },
  },
  plugins: [],
};
export default config;
```

---

## package.json

```json
{
  "name": "bedava-oyun",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.2.x",
    "react": "^18.3.x",
    "react-dom": "^18.3.x",
    "@supabase/supabase-js": "^2.x",
    "@supabase/ssr": "^0.6.x",
    "next-themes": "^0.3.x",
    "sonner": "^1.x",
    "lucide-react": "^0.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "@types/react": "^18.x",
    "@types/node": "^20.x",
    "tailwindcss": "^3.4.x",
    "autoprefixer": "^10.x",
    "postcss": "^8.x",
    "eslint": "^8.x",
    "eslint-config-next": "^14.x"
  }
}
```

**Toplam: 7 runtime + 7 dev = 14 paket.** Sade ve temiz.

---

## Ortam Değişkenleri

```env
# .env.local.example
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
NEXT_PUBLIC_APP_URL=https://bedava-oyun.com
```

---

## Deploy

```
1. GitHub repo → kodu push'la
2. Supabase proje oluştur (ücretsiz)
   - SQL Editor'da tabloları + RLS + trigger çalıştır
   - Auth > Email/Password aktif et
3. Vercel'e GitHub import
   - Env vars ekle
   - Custom domain: bedava-oyun.com
4. https://bedava-oyun.com 🎉

Maliyet: $0/ay
```

---

## Geliştirme Sırası

### Faz 1 — Altyapı + Mobil-Öncelikli Layout (3-4 gün)
1. `npx create-next-app@latest bedava-oyun --typescript --tailwind --app`
2. Supabase: proje + SQL (tablolar, RLS, trigger) + env
3. Supabase client helpers (client.ts, server.ts)
4. middleware.ts (auth redirect — sadece /profil)
5. Layout: Navbar (mobil hamburger dahil), Footer, ThemeToggle
6. Auth: /giris, /kayit sayfaları
7. Responsive test: 375px'ten başla
8. SEO: layout meta tags, generateMetadata altyapısı

### Faz 2 — İlk 2 Oyun + Skor (5-7 gün)
9. GameShell component (responsive canvas, timer, zorluk)
10. useSwipe hook + ses sistemi
11. **Mayın Tarlası** — engine + renderer + React wrapper (2-3 gün)
    - Mobil: tap = aç, long press = bayrak
12. **Yılan** — engine + swipe kontrol (1-2 gün)
13. API: POST /api/scores + anti-cheat
14. API: GET /api/leaderboard/[gameSlug] + CDN cache
15. Sıralama sayfası (frontend)
16. GameOverModal (misafir CTA: "Giriş yap")

### Faz 3 — Kalan 2 Oyun + Profil (5-7 gün)
17. **2048** — engine + swipe (2 gün)
18. **Kelime Tahmin** — engine + kelime listesi + ekran klavyesi (2-3 gün)
19. Profil sayfası (istatistikler)
20. Ana sayfa: oyun kartları + kişisel en iyi skor

### Faz 4 — Cilalama + Deploy (3-4 gün)
21. PWA manifest
22. OpenGraph görselleri
23. Mobil test (gerçek cihaz)
24. Lighthouse audit + fix
25. Deploy: Vercel + Supabase + DNS

**Toplam: ~16-22 gün full-time / ~4-5 hafta part-time**

---

## v2 Yol Haritası

- [ ] Yeni oyunlar: Sudoku, Tetris, XOX, Hafıza, Nonogram, Lights Out
- [ ] Başarım / rozet sistemi
- [ ] İngilizce dil desteği (i18n — [locale] segment + middleware)
- [ ] Günlük challenge
- [ ] Google AdSense

---

## Performans Hedefleri

| Metrik | Hedef |
|--------|-------|
| Lighthouse Performance | 90+ |
| First Contentful Paint | < 1.2s |
| Time to Interactive | < 2.5s |
| Oyun başlatma | < 500ms |
| API (cache hit) | < 50ms |
| API (cache miss) | < 400ms |
| Bundle (ana sayfa) | < 80KB gz |
| Bundle (oyun sayfası) | < 120KB gz |
