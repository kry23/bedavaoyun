import type { Country, Guess, GlobleState } from "./types";
import { MAX_DISTANCE } from "./types";
import { COUNTRIES } from "./countries";

const DEG = Math.PI / 180;

/** Haversine distance in km between two points */
export function haversine(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * DEG;
  const dLng = (lng2 - lng1) * DEG;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * DEG) * Math.cos(lat2 * DEG) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Bearing from point 1 to point 2 in degrees (0=N, 90=E, 180=S, 270=W) */
export function bearing(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLng = (lng2 - lng1) * DEG;
  const y = Math.sin(dLng) * Math.cos(lat2 * DEG);
  const x =
    Math.cos(lat1 * DEG) * Math.sin(lat2 * DEG) -
    Math.sin(lat1 * DEG) * Math.cos(lat2 * DEG) * Math.cos(dLng);
  const brng = Math.atan2(y, x) / DEG;
  return (brng + 360) % 360;
}

/** Direction arrow emoji from bearing */
export function directionArrow(deg: number): string {
  const arrows = ["⬆️", "↗️", "➡️", "↘️", "⬇️", "↙️", "⬅️", "↖️"];
  const idx = Math.round(deg / 45) % 8;
  return arrows[idx];
}

/** Proximity score 0-100 (100 = exact, 0 = maximally far) */
export function proximity(distance: number): number {
  return Math.max(0, Math.round((1 - distance / MAX_DISTANCE) * 100));
}

/** Color for proximity value */
export function proximityColor(prox: number): string {
  if (prox >= 100) return "#16a34a"; // green – exact
  if (prox >= 90) return "#991b1b";  // dark red – very close
  if (prox >= 75) return "#dc2626";  // red
  if (prox >= 60) return "#ea580c";  // dark orange
  if (prox >= 45) return "#f59e0b";  // orange
  if (prox >= 30) return "#fbbf24";  // amber
  return "#fde68a";                   // light yellow – far
}

/** Pick a random target country */
export function createGame(): GlobleState {
  const target = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
  return { target, guesses: [], status: "playing" };
}

/** Make a guess */
export function makeGuess(state: GlobleState, country: Country): GlobleState {
  if (state.status !== "playing") return state;
  // Already guessed?
  if (state.guesses.some((g) => g.country.code === country.code)) return state;

  const dist = haversine(
    country.lat,
    country.lng,
    state.target.lat,
    state.target.lng
  );
  const dir = bearing(
    country.lat,
    country.lng,
    state.target.lat,
    state.target.lng
  );
  const prox = proximity(dist);

  const guess: Guess = {
    country,
    distance: Math.round(dist),
    direction: dir,
    proximity: prox,
  };

  const isCorrect = country.code === state.target.code;
  const newGuesses = [...state.guesses, guess];

  return {
    ...state,
    guesses: newGuesses,
    status: isCorrect ? "won" : "playing",
  };
}

/** Normalize string for accent-insensitive search */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u");
}

/** Search countries by name */
export function searchCountries(
  query: string,
  locale: "tr" | "en",
  exclude: Set<string>
): Country[] {
  const q = normalize(query.trim());
  if (!q) return [];
  return COUNTRIES.filter((c) => {
    if (exclude.has(c.code)) return false;
    const name = locale === "tr" ? c.nameTr : c.nameEn;
    return normalize(name).includes(q);
  }).slice(0, 8);
}
