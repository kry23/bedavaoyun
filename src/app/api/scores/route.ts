import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validateScore } from "@/lib/score-validator";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  const body = await req.json();
  const { gameSlug, score, difficulty, duration, moves, won, metadata } = body;

  const validation = validateScore({
    gameSlug,
    score,
    difficulty,
    duration,
    moves,
  });

  if (!validation.valid) {
    return NextResponse.json({ error: validation.reason }, { status: 400 });
  }

  // Note: Types will be fully resolved when connected to a real Supabase project
  // using `npx supabase gen types typescript`
  const { data, error } = await supabase
    .from("scores")
    .insert({
      user_id: user.id,
      game_slug: gameSlug,
      score,
      difficulty,
      duration,
      moves,
      won,
      metadata,
    } as never)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
