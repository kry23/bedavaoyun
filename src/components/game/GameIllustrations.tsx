"use client";

import type { ReactNode } from "react";

/* ── WORDLE illustrations ──────────────────────────── */
type WTileColor = "green" | "yellow" | "gray" | "empty";
const wColors: Record<WTileColor, string> = {
  green: "bg-green-500 text-white",
  yellow: "bg-yellow-500 text-white",
  gray: "bg-gray-400 text-white",
  empty: "bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200",
};

function WordleRow({
  letters,
  colors,
}: {
  letters: string[];
  colors: WTileColor[];
}) {
  return (
    <div className="flex gap-1">
      {letters.map((l, i) => (
        <div
          key={i}
          className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center font-bold text-sm sm:text-base rounded ${wColors[colors[i]]}`}
        >
          {l}
        </div>
      ))}
    </div>
  );
}

const WordleStep1 = () => (
  <div className="flex flex-col items-center gap-1 py-3">
    <WordleRow
      letters={["D", "E", "N", "İ", "Z"]}
      colors={["gray", "green", "gray", "green", "gray"]}
    />
  </div>
);

const WordleStep2 = () => (
  <div className="flex flex-col items-center gap-1 py-3">
    <WordleRow
      letters={["D", "E", "N", "İ", "Z"]}
      colors={["gray", "green", "gray", "green", "gray"]}
    />
    <WordleRow
      letters={["M", "Ü", "Z", "İ", "K"]}
      colors={["yellow", "gray", "gray", "green", "gray"]}
    />
  </div>
);

const WordleStep3 = () => (
  <div className="flex flex-col items-center gap-1 py-3">
    <WordleRow
      letters={["D", "E", "N", "İ", "Z"]}
      colors={["gray", "green", "gray", "green", "gray"]}
    />
    <WordleRow
      letters={["M", "Ü", "Z", "İ", "K"]}
      colors={["yellow", "gray", "gray", "green", "gray"]}
    />
    <WordleRow
      letters={["R", "E", "S", "İ", "M"]}
      colors={["green", "green", "green", "green", "green"]}
    />
  </div>
);

/* ── MINESWEEPER illustrations ─────────────────────── */
type MCell = { v: string; revealed?: boolean; flag?: boolean; mine?: boolean };

function MineGrid({ cells }: { cells: MCell[][] }) {
  const numColor: Record<string, string> = {
    "1": "text-blue-600",
    "2": "text-green-600",
    "3": "text-red-600",
    "4": "text-purple-700",
  };
  return (
    <div className="inline-grid gap-[2px] p-1 bg-gray-300 dark:bg-gray-600 rounded">
      {cells.map((row, ri) => (
        <div key={ri} className="flex gap-[2px]">
          {row.map((c, ci) => (
            <div
              key={ci}
              className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs font-bold rounded-sm ${
                c.revealed
                  ? "bg-gray-100 dark:bg-gray-800"
                  : "bg-blue-400 dark:bg-blue-600"
              } ${c.revealed && c.v && numColor[c.v] ? numColor[c.v] : ""}`}
            >
              {c.flag ? "🚩" : c.mine ? "💣" : c.revealed ? c.v : ""}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

const MineStep1 = () => (
  <div className="flex justify-center py-3">
    <MineGrid
      cells={[
        [{ v: "" }, { v: "" }, { v: "" }, { v: "" }, { v: "" }],
        [{ v: "" }, { v: "" }, { v: "👆", revealed: true }, { v: "" }, { v: "" }],
        [{ v: "" }, { v: "" }, { v: "" }, { v: "" }, { v: "" }],
        [{ v: "" }, { v: "" }, { v: "" }, { v: "" }, { v: "" }],
      ]}
    />
  </div>
);

const MineStep2 = () => (
  <div className="flex justify-center py-3">
    <MineGrid
      cells={[
        [
          { v: "", revealed: true },
          { v: "1", revealed: true },
          { v: "" },
          { v: "1", revealed: true },
          { v: "", revealed: true },
        ],
        [
          { v: "", revealed: true },
          { v: "2", revealed: true },
          { v: "" },
          { v: "2", revealed: true },
          { v: "", revealed: true },
        ],
        [
          { v: "", revealed: true },
          { v: "1", revealed: true },
          { v: "" },
          { v: "3", revealed: true },
          { v: "" },
        ],
        [
          { v: "", revealed: true },
          { v: "", revealed: true },
          { v: "" },
          { v: "" },
          { v: "" },
        ],
      ]}
    />
  </div>
);

const MineStep3 = () => (
  <div className="flex justify-center py-3">
    <MineGrid
      cells={[
        [
          { v: "", revealed: true },
          { v: "1", revealed: true },
          { v: "", flag: true },
          { v: "1", revealed: true },
          { v: "", revealed: true },
        ],
        [
          { v: "", revealed: true },
          { v: "2", revealed: true },
          { v: "" },
          { v: "2", revealed: true },
          { v: "", revealed: true },
        ],
        [
          { v: "", revealed: true },
          { v: "1", revealed: true },
          { v: "" },
          { v: "3", revealed: true },
          { v: "", flag: true },
        ],
        [
          { v: "", revealed: true },
          { v: "", revealed: true },
          { v: "" },
          { v: "" },
          { v: "" },
        ],
      ]}
    />
  </div>
);

/* ── 2048 illustrations ────────────────────────────── */
const tileColor: Record<number, string> = {
  2: "bg-amber-100 text-gray-700",
  4: "bg-amber-200 text-gray-700",
  8: "bg-orange-300 text-white",
  16: "bg-orange-400 text-white",
  32: "bg-orange-500 text-white",
  64: "bg-red-400 text-white",
  128: "bg-yellow-300 text-gray-800",
  256: "bg-yellow-400 text-gray-800",
  512: "bg-yellow-500 text-white",
  1024: "bg-yellow-600 text-white",
  2048: "bg-yellow-500 text-white",
  0: "bg-gray-200 dark:bg-gray-700",
};

function TileGrid2048({ grid }: { grid: number[][] }) {
  return (
    <div className="inline-grid grid-cols-4 gap-1 p-2 bg-gray-300 dark:bg-gray-600 rounded-lg">
      {grid.flat().map((n, i) => (
        <div
          key={i}
          className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center font-bold text-xs sm:text-sm rounded ${
            tileColor[n] || tileColor[0]
          }`}
        >
          {n || ""}
        </div>
      ))}
    </div>
  );
}

const G2048Step1 = () => (
  <div className="flex justify-center items-center gap-3 py-3">
    <TileGrid2048
      grid={[
        [0, 0, 2, 0],
        [0, 0, 0, 0],
        [0, 4, 0, 0],
        [0, 0, 0, 2],
      ]}
    />
    <span className="text-2xl">→</span>
    <TileGrid2048
      grid={[
        [0, 0, 0, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 4],
        [0, 0, 0, 2],
      ]}
    />
  </div>
);

const G2048Step2 = () => (
  <div className="flex justify-center items-center gap-3 py-3">
    <div className="flex items-center gap-1">
      <div className={`w-10 h-10 flex items-center justify-center font-bold text-sm rounded ${tileColor[2]}`}>2</div>
      <span className="text-lg font-bold">+</span>
      <div className={`w-10 h-10 flex items-center justify-center font-bold text-sm rounded ${tileColor[2]}`}>2</div>
      <span className="text-lg font-bold">=</span>
      <div className={`w-10 h-10 flex items-center justify-center font-bold text-sm rounded ${tileColor[4]}`}>4</div>
    </div>
    <div className="mx-2 text-gray-400">|</div>
    <div className="flex items-center gap-1">
      <div className={`w-10 h-10 flex items-center justify-center font-bold text-sm rounded ${tileColor[4]}`}>4</div>
      <span className="text-lg font-bold">+</span>
      <div className={`w-10 h-10 flex items-center justify-center font-bold text-sm rounded ${tileColor[4]}`}>4</div>
      <span className="text-lg font-bold">=</span>
      <div className={`w-10 h-10 flex items-center justify-center font-bold text-sm rounded ${tileColor[8]}`}>8</div>
    </div>
  </div>
);

const G2048Step3 = () => (
  <div className="flex justify-center py-3">
    <div className={`w-20 h-20 flex items-center justify-center font-extrabold text-2xl rounded-lg ${tileColor[2048]} ring-4 ring-yellow-400 shadow-lg`}>
      2048
    </div>
  </div>
);

/* ── SNAKE illustrations ───────────────────────────── */
function SnakeGrid({
  cells,
}: {
  cells: ("s" | "h" | "f" | "")[][];
}) {
  const color = {
    s: "bg-green-500",
    h: "bg-green-700",
    f: "bg-red-500",
    "": "bg-gray-100 dark:bg-gray-800",
  };
  return (
    <div className="inline-grid gap-[1px] p-1 bg-gray-300 dark:bg-gray-600 rounded">
      {cells.map((row, ri) => (
        <div key={ri} className="flex gap-[1px]">
          {row.map((c, ci) => (
            <div
              key={ci}
              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-sm ${color[c]}`}
            >
              {c === "f" ? (
                <span className="flex items-center justify-center text-[10px]">🍎</span>
              ) : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

const SnakeStep1 = () => (
  <div className="flex justify-center py-3">
    <SnakeGrid
      cells={[
        ["", "", "", "", "", "", ""],
        ["", "", "", "", "", "", ""],
        ["", "", "s", "s", "h", "", ""],
        ["", "", "", "", "", "", ""],
        ["", "", "", "", "", "f", ""],
        ["", "", "", "", "", "", ""],
      ]}
    />
  </div>
);

const SnakeStep2 = () => (
  <div className="flex justify-center py-3">
    <SnakeGrid
      cells={[
        ["", "", "", "", "", "", ""],
        ["", "", "", "", "", "", ""],
        ["", "", "s", "s", "s", "h", ""],
        ["", "", "", "", "", "", ""],
        ["", "", "", "", "", "", ""],
        ["", "f", "", "", "", "", ""],
      ]}
    />
  </div>
);

/* ── SUDOKU illustrations ──────────────────────────── */
function SudokuMini({ grid, highlights }: { grid: (number | "")[][]; highlights?: [number, number][] }) {
  const hSet = new Set((highlights || []).map(([r, c]) => `${r}-${c}`));
  return (
    <div className="inline-grid gap-0 border-2 border-gray-800 dark:border-gray-300 rounded">
      {grid.map((row, ri) => (
        <div key={ri} className="flex">
          {row.map((c, ci) => (
            <div
              key={ci}
              className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-[10px] sm:text-xs font-bold
                ${ci % 3 === 2 && ci < 8 ? "border-r-2 border-r-gray-800 dark:border-r-gray-300" : ci < 8 ? "border-r border-r-gray-300 dark:border-r-gray-600" : ""}
                ${ri % 3 === 2 && ri < 8 ? "border-b-2 border-b-gray-800 dark:border-b-gray-300" : ri < 8 ? "border-b border-b-gray-300 dark:border-b-gray-600" : ""}
                ${hSet.has(`${ri}-${ci}`) ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" : c ? "text-gray-800 dark:text-gray-200" : ""}
              `}
            >
              {c || ""}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

const SudokuStep1 = () => (
  <div className="flex justify-center py-3">
    <SudokuMini
      grid={[
        [5, 3, "", "", 7, "", "", "", ""],
        [6, "", "", 1, 9, 5, "", "", ""],
        ["", 9, 8, "", "", "", "", 6, ""],
        [8, "", "", "", 6, "", "", "", 3],
        [4, "", "", 8, "", 3, "", "", 1],
        [7, "", "", "", 2, "", "", "", 6],
        ["", 6, "", "", "", "", 2, 8, ""],
        ["", "", "", 4, 1, 9, "", "", 5],
        ["", "", "", "", 8, "", "", 7, 9],
      ]}
      highlights={[[0, 2], [0, 3], [0, 5], [0, 6], [0, 7], [0, 8]]}
    />
  </div>
);

const SudokuStep2 = () => (
  <div className="flex justify-center py-3">
    <SudokuMini
      grid={[
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, "", "", 1, 9, 5, "", "", ""],
        ["", 9, 8, "", "", "", "", 6, ""],
        [8, "", "", "", 6, "", "", "", 3],
        [4, "", "", 8, "", 3, "", "", 1],
        [7, "", "", "", 2, "", "", "", 6],
        ["", 6, "", "", "", "", 2, 8, ""],
        ["", "", "", 4, 1, 9, "", "", 5],
        ["", "", "", "", 8, "", "", 7, 9],
      ]}
      highlights={[[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8]]}
    />
  </div>
);

/* ── MAHJONG illustrations ─────────────────────────── */
function MahjongTile({
  emoji,
  label,
  free,
  selected,
  dim,
}: {
  emoji: string;
  label: string;
  free?: boolean;
  selected?: boolean;
  dim?: boolean;
}) {
  return (
    <div
      className={`w-10 h-12 sm:w-11 sm:h-14 rounded-md flex flex-col items-center justify-center text-[10px] font-bold border-2
        ${selected ? "border-blue-500 bg-blue-50 dark:bg-blue-900/40 ring-2 ring-blue-400" : free ? "border-amber-400 bg-amber-50 dark:bg-amber-900/30" : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"}
        ${dim ? "opacity-40" : ""}
        shadow-sm`}
      style={dim ? {} : { boxShadow: "2px 2px 0 rgba(0,0,0,0.15)" }}
    >
      <span className="text-sm sm:text-base leading-none">{emoji}</span>
      <span className="text-[8px] text-gray-500 dark:text-gray-400">{label}</span>
    </div>
  );
}

const MahjongStep1 = () => (
  <div className="flex justify-center py-3">
    <div className="relative">
      <div className="flex gap-1">
        <MahjongTile emoji="🎋" label="1" free />
        <MahjongTile emoji="●" label="3" dim />
        <MahjongTile emoji="🀄" label="" free />
        <MahjongTile emoji="字" label="5" dim />
        <MahjongTile emoji="🎋" label="7" free />
      </div>
      <div className="flex gap-1 mt-[-8px] ml-3 relative z-10">
        <MahjongTile emoji="●" label="2" dim />
        <MahjongTile emoji="東" label="" dim />
        <MahjongTile emoji="🌸" label="" dim />
      </div>
      <div className="text-[10px] text-center mt-2 text-amber-600 dark:text-amber-400 font-medium">
        ↑ Serbest taşlar parlak görünür
      </div>
    </div>
  </div>
);

const MahjongStep2 = () => (
  <div className="flex justify-center items-center gap-3 py-3">
    <MahjongTile emoji="🎋" label="3" selected />
    <span className="text-xl">🔗</span>
    <MahjongTile emoji="🎋" label="3" selected />
    <span className="text-lg font-bold text-green-500 ml-2">✓ Eşleşti!</span>
  </div>
);

const MahjongStep3 = () => (
  <div className="flex justify-center items-center gap-2 py-3">
    <div className="flex gap-1 items-center px-3 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
      <span className="text-lg">💡</span>
      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">İpucu</span>
    </div>
    <div className="flex gap-1 items-center px-3 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
      <span className="text-lg">🔀</span>
      <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Karıştır</span>
    </div>
    <div className="flex gap-1 items-center px-3 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
      <span className="text-lg">↩️</span>
      <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Geri Al</span>
    </div>
  </div>
);

/* ── TETRIS illustrations ──────────────────────────── */
function TetrisGrid({ cells }: { cells: (string | "")[][] }) {
  return (
    <div className="inline-grid gap-0 border-2 border-gray-400 dark:border-gray-600 rounded bg-gray-900">
      {cells.map((row, ri) => (
        <div key={ri} className="flex">
          {row.map((c, ci) => (
            <div
              key={ci}
              className={`w-5 h-5 sm:w-6 sm:h-6 border border-gray-800 ${c || "bg-gray-900"}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

const TetrisStep1 = () => (
  <div className="flex justify-center py-3">
    <TetrisGrid
      cells={[
        ["", "", "", "bg-cyan-400", "bg-cyan-400", "", "", ""],
        ["", "", "", "bg-cyan-400", "bg-cyan-400", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["bg-purple-500", "", "", "", "", "", "bg-red-500", "bg-red-500"],
        ["bg-purple-500", "bg-purple-500", "bg-green-500", "bg-green-500", "", "", "bg-red-500", "bg-red-500"],
      ]}
    />
  </div>
);

const TetrisStep2 = () => (
  <div className="flex justify-center py-3">
    <div className="relative">
      <TetrisGrid
        cells={[
          ["", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", ""],
          ["bg-orange-400", "", "bg-blue-500", "", "", "", "", "bg-red-500"],
          ["bg-orange-400", "bg-green-500", "bg-blue-500", "bg-cyan-400", "bg-cyan-400", "bg-yellow-400", "bg-red-500", "bg-red-500"],
          [
            "bg-purple-500",
            "bg-green-500",
            "bg-green-500",
            "bg-cyan-400",
            "bg-cyan-400",
            "bg-yellow-400",
            "bg-yellow-400",
            "bg-red-500",
          ],
        ]}
      />
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-yellow-400/30 border-2 border-yellow-400 border-dashed rounded-b flex items-center justify-center">
        <span className="text-[10px] font-bold text-yellow-200">✨ Satır tamamlandı!</span>
      </div>
    </div>
  </div>
);

/* ── PUZZLE 15 illustrations ───────────────────────── */
function Puzzle15Grid({ tiles }: { tiles: (number | "")[][] }) {
  return (
    <div className="inline-grid grid-cols-4 gap-1 p-2 bg-gray-300 dark:bg-gray-600 rounded-lg">
      {tiles.flat().map((n, i) => (
        <div
          key={i}
          className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center font-bold text-sm rounded-md
            ${n ? "bg-blue-500 text-white shadow" : "bg-gray-200 dark:bg-gray-700"}
          `}
        >
          {n || ""}
        </div>
      ))}
    </div>
  );
}

const Puzzle15Step1 = () => (
  <div className="flex justify-center items-center gap-3 py-3">
    <Puzzle15Grid
      tiles={[
        [1, 2, 3, 4],
        [5, 6, "", 7],
        [9, 10, 11, 8],
        [13, 14, 15, 12],
      ]}
    />
  </div>
);

const Puzzle15Step2 = () => (
  <div className="flex justify-center py-3">
    <Puzzle15Grid
      tiles={[
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, ""],
      ]}
    />
  </div>
);

/* ── CONNECTIONS illustrations ─────────────────────── */
function ConnectionsGrid({
  words,
  revealed,
}: {
  words: { text: string; color?: string }[];
  revealed?: { label: string; color: string; words: string[] }[];
}) {
  return (
    <div className="flex flex-col gap-1 items-center">
      {revealed?.map((g, i) => (
        <div
          key={i}
          className={`w-full py-2 px-3 rounded-lg text-center font-bold text-white text-xs sm:text-sm ${g.color}`}
        >
          {g.label}: {g.words.join(", ")}
        </div>
      ))}
      <div className="grid grid-cols-4 gap-1">
        {words.map((w, i) => (
          <div
            key={i}
            className={`px-2 py-2 rounded-lg text-center font-bold text-[10px] sm:text-xs min-w-[60px]
              ${w.color || "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}`}
          >
            {w.text}
          </div>
        ))}
      </div>
    </div>
  );
}

const ConnectionsStep1 = () => (
  <div className="flex justify-center py-3">
    <ConnectionsGrid
      words={[
        { text: "ELMA" }, { text: "MARS" }, { text: "RUBY" }, { text: "KAN" },
        { text: "ASLAN" }, { text: "KURT" }, { text: "AYI" }, { text: "KARTAL" },
        { text: "DO" }, { text: "RE" }, { text: "Mİ" }, { text: "FA" },
        { text: "GÖL" }, { text: "DENİZ" }, { text: "OKYANUS" }, { text: "AKARSU" },
      ]}
    />
  </div>
);

const ConnectionsStep2 = () => (
  <div className="flex justify-center py-3">
    <ConnectionsGrid
      words={[
        { text: "ELMA", color: "bg-blue-500 text-white" },
        { text: "MARS", color: "bg-blue-500 text-white" },
        { text: "RUBY", color: "bg-blue-500 text-white" },
        { text: "KAN", color: "bg-blue-500 text-white" },
        { text: "ASLAN" }, { text: "KURT" }, { text: "AYI" }, { text: "KARTAL" },
        { text: "DO" }, { text: "RE" }, { text: "Mİ" }, { text: "FA" },
        { text: "GÖL" }, { text: "DENİZ" }, { text: "OKYANUS" }, { text: "AKARSU" },
      ]}
    />
  </div>
);

const ConnectionsStep3 = () => (
  <div className="flex justify-center py-3">
    <ConnectionsGrid
      words={[
        { text: "ASLAN" }, { text: "KURT" }, { text: "AYI" }, { text: "KARTAL" },
        { text: "DO" }, { text: "RE" }, { text: "Mİ" }, { text: "FA" },
        { text: "GÖL" }, { text: "DENİZ" }, { text: "OKYANUS" }, { text: "AKARSU" },
      ]}
      revealed={[{ label: "🔴 Kırmızı Tonları", color: "bg-red-500", words: ["ELMA", "MARS", "RUBY", "KAN"] }]}
    />
  </div>
);

/* ── HANGMAN illustrations ─────────────────────────── */
function HangmanFigure({ parts }: { parts: number }) {
  return (
    <svg viewBox="0 0 120 120" className="w-20 h-20 sm:w-24 sm:h-24">
      {/* Gallow */}
      <line x1="20" y1="110" x2="100" y2="110" stroke="currentColor" strokeWidth="3" />
      <line x1="40" y1="110" x2="40" y2="15" stroke="currentColor" strokeWidth="3" />
      <line x1="40" y1="15" x2="75" y2="15" stroke="currentColor" strokeWidth="3" />
      <line x1="75" y1="15" x2="75" y2="28" stroke="currentColor" strokeWidth="2" />
      {/* Head */}
      {parts >= 1 && <circle cx="75" cy="38" r="10" fill="none" stroke="currentColor" strokeWidth="2" />}
      {/* Body */}
      {parts >= 2 && <line x1="75" y1="48" x2="75" y2="75" stroke="currentColor" strokeWidth="2" />}
      {/* Left arm */}
      {parts >= 3 && <line x1="75" y1="55" x2="58" y2="65" stroke="currentColor" strokeWidth="2" />}
      {/* Right arm */}
      {parts >= 4 && <line x1="75" y1="55" x2="92" y2="65" stroke="currentColor" strokeWidth="2" />}
      {/* Left leg */}
      {parts >= 5 && <line x1="75" y1="75" x2="58" y2="95" stroke="currentColor" strokeWidth="2" />}
      {/* Right leg */}
      {parts >= 6 && <line x1="75" y1="75" x2="92" y2="95" stroke="currentColor" strokeWidth="2" />}
    </svg>
  );
}

function WordBlanks({ word, revealed }: { word: string; revealed: Set<string> }) {
  return (
    <div className="flex gap-1">
      {Array.from(word).map((ch, i) =>
        ch === " " ? (
          <div key={i} className="w-3" />
        ) : (
          <div
            key={i}
            className="w-6 h-8 sm:w-7 sm:h-9 flex items-center justify-center font-bold text-sm border-b-2 border-gray-600 dark:border-gray-400"
          >
            {revealed.has(ch) ? ch : ""}
          </div>
        )
      )}
    </div>
  );
}

const HangmanStep1 = () => (
  <div className="flex justify-center items-center gap-4 py-3">
    <div className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-sm font-medium text-yellow-700 dark:text-yellow-300">
      🏷️ Hayvanlar
    </div>
    <WordBlanks word="FİL" revealed={new Set()} />
  </div>
);

const HangmanStep2 = () => (
  <div className="flex justify-center items-center gap-4 py-3">
    <HangmanFigure parts={1} />
    <div className="flex flex-col items-center gap-2">
      <WordBlanks word="FİL" revealed={new Set(["İ"])} />
      <div className="flex gap-1">
        <span className="px-2 py-1 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded text-xs font-bold">İ ✓</span>
        <span className="px-2 py-1 bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 rounded text-xs font-bold">A ✗</span>
      </div>
    </div>
  </div>
);

const HangmanStep3 = () => (
  <div className="flex justify-center items-center gap-4 py-3">
    <HangmanFigure parts={4} />
    <div className="text-center">
      <div className="flex gap-1 mb-2">
        {["❤️", "❤️", "🤍", "🤍", "🤍", "🤍"].map((h, i) => (
          <span key={i} className="text-sm">{h}</span>
        ))}
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400">4 yanlış = 4 parça</span>
    </div>
  </div>
);

const HangmanStep4 = () => (
  <div className="flex justify-center items-center gap-4 py-3">
    <HangmanFigure parts={0} />
    <div className="flex flex-col items-center gap-1">
      <WordBlanks word="FİL" revealed={new Set(["F", "İ", "L"])} />
      <span className="text-green-500 font-bold text-sm mt-1">🎉 Tebrikler!</span>
    </div>
  </div>
);

/* ── English variants for some illustrations ──────── */
const MahjongStep1En = () => (
  <div className="flex justify-center py-3">
    <div className="relative">
      <div className="flex gap-1">
        <MahjongTile emoji="🎋" label="1" free />
        <MahjongTile emoji="●" label="3" dim />
        <MahjongTile emoji="🀄" label="" free />
        <MahjongTile emoji="字" label="5" dim />
        <MahjongTile emoji="🎋" label="7" free />
      </div>
      <div className="flex gap-1 mt-[-8px] ml-3 relative z-10">
        <MahjongTile emoji="●" label="2" dim />
        <MahjongTile emoji="東" label="" dim />
        <MahjongTile emoji="🌸" label="" dim />
      </div>
      <div className="text-[10px] text-center mt-2 text-amber-600 dark:text-amber-400 font-medium">
        ↑ Free tiles appear bright
      </div>
    </div>
  </div>
);

const MahjongStep2En = () => (
  <div className="flex justify-center items-center gap-3 py-3">
    <MahjongTile emoji="🎋" label="3" selected />
    <span className="text-xl">🔗</span>
    <MahjongTile emoji="🎋" label="3" selected />
    <span className="text-lg font-bold text-green-500 ml-2">✓ Matched!</span>
  </div>
);

const MahjongStep3En = () => (
  <div className="flex justify-center items-center gap-2 py-3">
    <div className="flex gap-1 items-center px-3 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
      <span className="text-lg">💡</span>
      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Hint</span>
    </div>
    <div className="flex gap-1 items-center px-3 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
      <span className="text-lg">🔀</span>
      <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Shuffle</span>
    </div>
    <div className="flex gap-1 items-center px-3 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
      <span className="text-lg">↩️</span>
      <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Undo</span>
    </div>
  </div>
);

const HangmanStep1En = () => (
  <div className="flex justify-center items-center gap-4 py-3">
    <div className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-sm font-medium text-yellow-700 dark:text-yellow-300">
      🏷️ Animals
    </div>
    <WordBlanks word="CAT" revealed={new Set()} />
  </div>
);

const HangmanStep2En = () => (
  <div className="flex justify-center items-center gap-4 py-3">
    <HangmanFigure parts={1} />
    <div className="flex flex-col items-center gap-2">
      <WordBlanks word="CAT" revealed={new Set(["A"])} />
      <div className="flex gap-1">
        <span className="px-2 py-1 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded text-xs font-bold">A ✓</span>
        <span className="px-2 py-1 bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 rounded text-xs font-bold">E ✗</span>
      </div>
    </div>
  </div>
);

const HangmanStep4En = () => (
  <div className="flex justify-center items-center gap-4 py-3">
    <HangmanFigure parts={0} />
    <div className="flex flex-col items-center gap-1">
      <WordBlanks word="CAT" revealed={new Set(["C", "A", "T"])} />
      <span className="text-green-500 font-bold text-sm mt-1">🎉 Congratulations!</span>
    </div>
  </div>
);

/* Wordle EN variants */
const WordleStep1En = () => (
  <div className="flex flex-col items-center gap-1 py-3">
    <WordleRow
      letters={["C", "R", "A", "N", "E"]}
      colors={["gray", "gray", "yellow", "gray", "green"]}
    />
  </div>
);

const WordleStep2En = () => (
  <div className="flex flex-col items-center gap-1 py-3">
    <WordleRow
      letters={["C", "R", "A", "N", "E"]}
      colors={["gray", "gray", "yellow", "gray", "green"]}
    />
    <WordleRow
      letters={["S", "T", "A", "L", "E"]}
      colors={["green", "gray", "yellow", "gray", "green"]}
    />
  </div>
);

const WordleStep3En = () => (
  <div className="flex flex-col items-center gap-1 py-3">
    <WordleRow
      letters={["C", "R", "A", "N", "E"]}
      colors={["gray", "gray", "yellow", "gray", "green"]}
    />
    <WordleRow
      letters={["S", "T", "A", "L", "E"]}
      colors={["green", "gray", "yellow", "gray", "green"]}
    />
    <WordleRow
      letters={["S", "H", "A", "K", "E"]}
      colors={["green", "green", "green", "green", "green"]}
    />
  </div>
);

/* Connections EN */
const ConnectionsStep1En = () => (
  <div className="flex justify-center py-3">
    <ConnectionsGrid
      words={[
        { text: "APPLE" }, { text: "MARS" }, { text: "RUBY" }, { text: "BLOOD" },
        { text: "LION" }, { text: "WOLF" }, { text: "BEAR" }, { text: "EAGLE" },
        { text: "DO" }, { text: "RE" }, { text: "MI" }, { text: "FA" },
        { text: "LAKE" }, { text: "SEA" }, { text: "OCEAN" }, { text: "RIVER" },
      ]}
    />
  </div>
);

const ConnectionsStep2En = () => (
  <div className="flex justify-center py-3">
    <ConnectionsGrid
      words={[
        { text: "APPLE", color: "bg-blue-500 text-white" },
        { text: "MARS", color: "bg-blue-500 text-white" },
        { text: "RUBY", color: "bg-blue-500 text-white" },
        { text: "BLOOD", color: "bg-blue-500 text-white" },
        { text: "LION" }, { text: "WOLF" }, { text: "BEAR" }, { text: "EAGLE" },
        { text: "DO" }, { text: "RE" }, { text: "MI" }, { text: "FA" },
        { text: "LAKE" }, { text: "SEA" }, { text: "OCEAN" }, { text: "RIVER" },
      ]}
    />
  </div>
);

const ConnectionsStep3En = () => (
  <div className="flex justify-center py-3">
    <ConnectionsGrid
      words={[
        { text: "LION" }, { text: "WOLF" }, { text: "BEAR" }, { text: "EAGLE" },
        { text: "DO" }, { text: "RE" }, { text: "MI" }, { text: "FA" },
        { text: "LAKE" }, { text: "SEA" }, { text: "OCEAN" }, { text: "RIVER" },
      ]}
      revealed={[{ label: "🔴 Shades of Red", color: "bg-red-500", words: ["APPLE", "MARS", "RUBY", "BLOOD"] }]}
    />
  </div>
);

/* ── GLOBLE illustrations ──────────────────────────── */
function GlobleGuessRow({
  flag,
  name,
  dist,
  arrow,
  color,
}: {
  flag: string;
  name: string;
  dist: string;
  arrow: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-xs">
      <span className="text-base">{flag}</span>
      <span className="font-semibold flex-1">{name}</span>
      <span className="text-gray-500 tabular-nums">{dist}</span>
      <span>{arrow}</span>
      <div className="w-10 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: "60%", backgroundColor: color }} />
      </div>
    </div>
  );
}

const GlobleStep1 = () => (
  <div className="flex justify-center py-3">
    <div className="flex flex-col gap-2 min-w-[220px]">
      <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-xl border-2 border-blue-400">
        <span className="text-gray-400 text-sm">🔍</span>
        <span className="text-sm text-gray-500">Türkiye...</span>
      </div>
      <div className="flex flex-wrap gap-1 justify-center">
        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px]">🇹🇷 Türkiye</span>
        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px]">🇹🇲 Türkmenistan</span>
      </div>
    </div>
  </div>
);

const GlobleStep2 = () => (
  <div className="flex justify-center py-3">
    <div className="flex items-center gap-1 text-[10px]">
      <span>Uzak</span>
      <div className="flex gap-[2px]">
        {["#fde68a", "#fbbf24", "#f59e0b", "#ea580c", "#dc2626", "#991b1b", "#16a34a"].map((c) => (
          <div key={c} className="w-5 h-3 rounded-sm" style={{ backgroundColor: c }} />
        ))}
      </div>
      <span>Yakın</span>
    </div>
  </div>
);

const GlobleStep3 = () => (
  <div className="flex justify-center py-3">
    <div className="flex flex-col gap-1.5 min-w-[220px]">
      <GlobleGuessRow flag="🇧🇷" name="Brezilya" dist="9.500 km" arrow="↗️" color="#fde68a" />
      <GlobleGuessRow flag="🇩🇪" name="Almanya" dist="2.200 km" arrow="↘️" color="#ea580c" />
      <GlobleGuessRow flag="🇬🇷" name="Yunanistan" dist="550 km" arrow="➡️" color="#dc2626" />
    </div>
  </div>
);

const GlobleStep4 = () => (
  <div className="flex justify-center items-center gap-3 py-3">
    <span className="text-4xl">🌍</span>
    <div className="text-center">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🇹🇷</span>
        <span className="font-bold text-green-500 text-lg">Türkiye</span>
        <span className="text-lg">🎉</span>
      </div>
      <span className="text-xs text-gray-500">4 tahminde buldunuz!</span>
    </div>
  </div>
);

const GlobleStep1En = () => (
  <div className="flex justify-center py-3">
    <div className="flex flex-col gap-2 min-w-[220px]">
      <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-xl border-2 border-blue-400">
        <span className="text-gray-400 text-sm">🔍</span>
        <span className="text-sm text-gray-500">Brazil...</span>
      </div>
      <div className="flex flex-wrap gap-1 justify-center">
        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px]">🇧🇷 Brazil</span>
      </div>
    </div>
  </div>
);

const GlobleStep2En = () => (
  <div className="flex justify-center py-3">
    <div className="flex items-center gap-1 text-[10px]">
      <span>Far</span>
      <div className="flex gap-[2px]">
        {["#fde68a", "#fbbf24", "#f59e0b", "#ea580c", "#dc2626", "#991b1b", "#16a34a"].map((c) => (
          <div key={c} className="w-5 h-3 rounded-sm" style={{ backgroundColor: c }} />
        ))}
      </div>
      <span>Close</span>
    </div>
  </div>
);

const GlobleStep3En = () => (
  <div className="flex justify-center py-3">
    <div className="flex flex-col gap-1.5 min-w-[220px]">
      <GlobleGuessRow flag="🇧🇷" name="Brazil" dist="9,500 km" arrow="↗️" color="#fde68a" />
      <GlobleGuessRow flag="🇩🇪" name="Germany" dist="2,200 km" arrow="↘️" color="#ea580c" />
      <GlobleGuessRow flag="🇬🇷" name="Greece" dist="550 km" arrow="➡️" color="#dc2626" />
    </div>
  </div>
);

const GlobleStep4En = () => (
  <div className="flex justify-center items-center gap-3 py-3">
    <span className="text-4xl">🌍</span>
    <div className="text-center">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🇹🇷</span>
        <span className="font-bold text-green-500 text-lg">Turkey</span>
        <span className="text-lg">🎉</span>
      </div>
      <span className="text-xs text-gray-500">Found in 4 guesses!</span>
    </div>
  </div>
);

/* ── Illustration registry ─────────────────────────── */
const illustrationsTr: Record<string, Record<number, () => ReactNode>> = {
  wordle: { 0: WordleStep1, 1: WordleStep2, 2: WordleStep3 },
  minesweeper: { 0: MineStep1, 1: MineStep2, 2: MineStep3 },
  game2048: { 0: G2048Step1, 1: G2048Step2, 2: G2048Step3 },
  snake: { 0: SnakeStep1, 1: SnakeStep2 },
  sudoku: { 0: SudokuStep1, 3: SudokuStep2 },
  mahjong: { 0: MahjongStep1, 1: MahjongStep2, 2: MahjongStep3 },
  tetris: { 0: TetrisStep1, 1: TetrisStep2 },
  puzzle15: { 0: Puzzle15Step1, 1: Puzzle15Step2 },
  connections: { 0: ConnectionsStep1, 1: ConnectionsStep2, 2: ConnectionsStep3 },
  hangman: { 0: HangmanStep1, 1: HangmanStep2, 2: HangmanStep3, 3: HangmanStep4 },
  globle: { 0: GlobleStep1, 1: GlobleStep2, 2: GlobleStep3, 3: GlobleStep4 },
};

const illustrationsEn: Record<string, Record<number, () => ReactNode>> = {
  wordle: { 0: WordleStep1En, 1: WordleStep2En, 2: WordleStep3En },
  minesweeper: { 0: MineStep1, 1: MineStep2, 2: MineStep3 },
  game2048: { 0: G2048Step1, 1: G2048Step2, 2: G2048Step3 },
  snake: { 0: SnakeStep1, 1: SnakeStep2 },
  sudoku: { 0: SudokuStep1, 3: SudokuStep2 },
  mahjong: { 0: MahjongStep1En, 1: MahjongStep2En, 2: MahjongStep3En },
  tetris: { 0: TetrisStep1, 1: TetrisStep2 },
  puzzle15: { 0: Puzzle15Step1, 1: Puzzle15Step2 },
  connections: { 0: ConnectionsStep1En, 1: ConnectionsStep2En, 2: ConnectionsStep3En },
  hangman: { 0: HangmanStep1En, 1: HangmanStep2En, 2: HangmanStep3, 3: HangmanStep4En },
  globle: { 0: GlobleStep1En, 1: GlobleStep2En, 2: GlobleStep3En, 3: GlobleStep4En },
};

export function getStepIllustration(
  gameSlug: string,
  stepIndex: number,
  locale: "tr" | "en"
): ReactNode | null {
  const map = locale === "tr" ? illustrationsTr : illustrationsEn;
  const gameMap = map[gameSlug];
  if (!gameMap) return null;
  const Comp = gameMap[stepIndex];
  return Comp ? <Comp /> : null;
}
