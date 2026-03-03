import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Simple in-memory rate limit (resets on deploy)
const recentSubmissions = new Map<string, number[]>();
const RATE_LIMIT = 3; // max submissions
const RATE_WINDOW_MS = 60_000; // per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = recentSubmissions.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_WINDOW_MS);
  recentSubmissions.set(ip, recent);
  return recent.length >= RATE_LIMIT;
}

function recordSubmission(ip: string) {
  const timestamps = recentSubmissions.get(ip) || [];
  timestamps.push(Date.now());
  recentSubmissions.set(ip, timestamps);
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  const body = await req.json();
  const { name, email, category, message, website } = body;

  // Honeypot: if "website" field is filled, it's a bot
  if (website) {
    // Pretend success to fool bots
    return NextResponse.json({ success: true }, { status: 201 });
  }

  // Validation
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ error: "Name is required (min 2 chars)" }, { status: 400 });
  }
  if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }
  const validCategories = ["general", "suggestion", "bug", "improvement"];
  if (!category || !validCategories.includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }
  if (!message || typeof message !== "string" || message.trim().length < 10) {
    return NextResponse.json({ error: "Message is required (min 10 chars)" }, { status: 400 });
  }
  if (message.length > 1000) {
    return NextResponse.json({ error: "Message too long (max 1000 chars)" }, { status: 400 });
  }

  const supabase = await createClient();

  // Check if user is logged in (optional)
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("feedback")
    .insert({
      user_id: user?.id || null,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      category,
      message: message.trim(),
    } as never);

  if (error) {
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
  }

  recordSubmission(ip);

  return NextResponse.json({ success: true }, { status: 201 });
}
