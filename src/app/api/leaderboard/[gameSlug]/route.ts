import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { gameRegistry } from "@/lib/game-registry";

export async function GET(
  req: NextRequest,
  { params }: { params: { gameSlug: string } }
) {
  const game = gameRegistry[params.gameSlug];
  if (!game) {
    return NextResponse.json({ error: "Bilinmeyen oyun" }, { status: 404 });
  }

  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") || "all";
  const difficulty = searchParams.get("difficulty");
  const limit = Math.min(
    parseInt(searchParams.get("limit") || "50"),
    100
  );

  let query = supabase
    .from("scores")
    .select("*, profiles(username, avatar)")
    .eq("game_slug", params.gameSlug)
    .eq("won", true)
    .order("score", { ascending: game.sortDirection === "asc" })
    .limit(limit);

  if (difficulty) {
    query = query.eq("difficulty", difficulty);
  }

  if (period === "daily") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    query = query.gte("created_at", today.toISOString());
  } else if (period === "weekly") {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    query = query.gte("created_at", weekAgo.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
