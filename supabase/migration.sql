-- ============================================
-- Bedava Oyun — Supabase Migration
-- Supabase Dashboard → SQL Editor'da çalıştır
-- ============================================

-- 1. Profiller (Supabase Auth ile senkronize)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- updated_at otomatik güncelleme
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auth trigger: yeni kullanıcı → otomatik profil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'username',
      'user_' || LEFT(NEW.id::text, 8)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Skorlar
CREATE TABLE IF NOT EXISTS scores (
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

-- Performans indexleri
CREATE INDEX IF NOT EXISTS idx_scores_game_score ON scores(game_slug, score DESC);
CREATE INDEX IF NOT EXISTS idx_scores_game_duration ON scores(game_slug, duration ASC);
CREATE INDEX IF NOT EXISTS idx_scores_user_game ON scores(user_id, game_slug);
CREATE INDEX IF NOT EXISTS idx_scores_created ON scores(created_at DESC);

-- 3. Row Level Security
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
