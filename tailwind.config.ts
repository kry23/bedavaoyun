import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
        },
      },
      keyframes: {
        "wordle-flip": {
          "0%": { transform: "rotateX(0deg)" },
          "50%": { transform: "rotateX(-90deg)" },
          "100%": { transform: "rotateX(0deg)" },
        },
        "wordle-shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-4px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(4px)" },
        },
        "wordle-pop": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.12)" },
          "100%": { transform: "scale(1)" },
        },
        "wordle-bounce": {
          "0%, 20%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(-16px)" },
          "50%": { transform: "translateY(4px)" },
          "60%": { transform: "translateY(-8px)" },
          "80%": { transform: "translateY(2px)" },
          "100%": { transform: "translateY(0)" },
        },
        "conn-shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
        },
        "conn-pop": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.08)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "conn-banner-in": {
          "0%": { transform: "scaleY(0)", opacity: "0" },
          "60%": { transform: "scaleY(1.05)", opacity: "1" },
          "100%": { transform: "scaleY(1)", opacity: "1" },
        },
        "conn-tile-out": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.8)", opacity: "0" },
        },
        "sudoku-pop": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)" },
        },
        "sudoku-error": {
          "0%, 100%": { transform: "translateX(0)" },
          "15%, 45%, 75%": { transform: "translateX(-3px)" },
          "30%, 60%, 90%": { transform: "translateX(3px)" },
        },
        "sudoku-win": {
          "0%": { transform: "scale(1)", backgroundColor: "transparent" },
          "50%": { transform: "scale(1.05)", backgroundColor: "rgb(34 197 94 / 0.15)" },
          "100%": { transform: "scale(1)", backgroundColor: "transparent" },
        },
      },
      animation: {
        "wordle-flip": "wordle-flip 0.5s ease-in-out",
        "wordle-shake": "wordle-shake 0.5s ease-in-out",
        "wordle-pop": "wordle-pop 0.15s ease-in-out",
        "wordle-bounce": "wordle-bounce 1s ease",
        "conn-shake": "conn-shake 0.5s ease-in-out",
        "conn-pop": "conn-pop 0.2s ease-out",
        "conn-banner-in": "conn-banner-in 0.4s ease-out",
        "conn-tile-out": "conn-tile-out 0.3s ease-in forwards",
        "sudoku-pop": "sudoku-pop 0.2s ease-out",
        "sudoku-error": "sudoku-error 0.4s ease-in-out",
        "sudoku-win": "sudoku-win 0.6s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
