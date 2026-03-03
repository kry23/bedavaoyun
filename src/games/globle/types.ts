export interface Country {
  code: string;       // ISO 3166-1 alpha-2
  nameTr: string;
  nameEn: string;
  lat: number;
  lng: number;
  flag: string;       // emoji flag
}

export interface Guess {
  country: Country;
  distance: number;   // km
  direction: number;  // bearing in degrees (0=N, 90=E, 180=S, 270=W)
  proximity: number;  // 0-100 (100 = exact match)
}

export interface GlobleState {
  target: Country;
  guesses: Guess[];
  status: "playing" | "won";
}

export const MAX_DISTANCE = 20_000; // approx half circumference of Earth in km
