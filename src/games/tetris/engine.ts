import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  TETROMINO_SHAPES,
  type Tetromino,
  type TetrominoType,
  type TetrisState,
} from "./types";

const TYPES: TetrominoType[] = ["I", "O", "T", "S", "Z", "J", "L"];

function randomTetromino(): Tetromino {
  const type = TYPES[Math.floor(Math.random() * TYPES.length)];
  return {
    type,
    shape: TETROMINO_SHAPES[type].map((r) => [...r]),
    pos: { x: Math.floor((BOARD_WIDTH - TETROMINO_SHAPES[type][0].length) / 2), y: 0 },
  };
}

function createEmptyBoard(): (string | null)[][] {
  return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null));
}

export function createGame(): TetrisState {
  return {
    board: createEmptyBoard(),
    current: randomTetromino(),
    next: randomTetromino(),
    status: "playing",
    score: 0,
    lines: 0,
    level: 1,
  };
}

function collides(board: (string | null)[][], piece: Tetromino): boolean {
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (piece.shape[r][c]) {
        const nx = piece.pos.x + c;
        const ny = piece.pos.y + r;
        if (nx < 0 || nx >= BOARD_WIDTH || ny >= BOARD_HEIGHT) return true;
        if (ny >= 0 && board[ny][nx] !== null) return true;
      }
    }
  }
  return false;
}

function lockPiece(board: (string | null)[][], piece: Tetromino): (string | null)[][] {
  const newBoard = board.map((r) => [...r]);
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (piece.shape[r][c]) {
        const ny = piece.pos.y + r;
        const nx = piece.pos.x + c;
        if (ny >= 0 && ny < BOARD_HEIGHT && nx >= 0 && nx < BOARD_WIDTH) {
          newBoard[ny][nx] = piece.type;
        }
      }
    }
  }
  return newBoard;
}

function clearLines(board: (string | null)[][]): { board: (string | null)[][]; cleared: number } {
  const kept = board.filter((row) => row.some((cell) => cell === null));
  const cleared = BOARD_HEIGHT - kept.length;
  const emptyRows = Array.from({ length: cleared }, () => Array(BOARD_WIDTH).fill(null));
  return { board: [...emptyRows, ...kept], cleared };
}

const LINE_SCORES = [0, 100, 300, 500, 800];

export function moveLeft(state: TetrisState): TetrisState {
  if (state.status !== "playing") return state;
  const moved = { ...state.current, pos: { ...state.current.pos, x: state.current.pos.x - 1 } };
  if (!collides(state.board, moved)) return { ...state, current: moved };
  return state;
}

export function moveRight(state: TetrisState): TetrisState {
  if (state.status !== "playing") return state;
  const moved = { ...state.current, pos: { ...state.current.pos, x: state.current.pos.x + 1 } };
  if (!collides(state.board, moved)) return { ...state, current: moved };
  return state;
}

export function moveDown(state: TetrisState): TetrisState {
  if (state.status !== "playing") return state;
  const moved = { ...state.current, pos: { ...state.current.pos, y: state.current.pos.y + 1 } };
  if (!collides(state.board, moved)) return { ...state, current: moved };

  // Lock piece
  const newBoard = lockPiece(state.board, state.current);
  const { board: clearedBoard, cleared } = clearLines(newBoard);
  const newLines = state.lines + cleared;
  const newLevel = Math.floor(newLines / 10) + 1;
  const newScore = state.score + LINE_SCORES[cleared] * state.level;

  const next = randomTetromino();
  if (collides(clearedBoard, state.next)) {
    return { ...state, board: clearedBoard, status: "gameover", score: newScore, lines: newLines, level: newLevel };
  }

  return {
    ...state,
    board: clearedBoard,
    current: state.next,
    next,
    score: newScore,
    lines: newLines,
    level: newLevel,
  };
}

export function hardDrop(state: TetrisState): TetrisState {
  if (state.status !== "playing") return state;
  let s = state;
  let prev = s;
  while (s.status === "playing") {
    prev = s;
    s = moveDown(s);
    if (s === prev) break; // couldn't move down, piece was locked
    if (s.current !== prev.current) break; // piece changed = locked
  }
  return s;
}

export function rotate(state: TetrisState): TetrisState {
  if (state.status !== "playing") return state;
  const { shape } = state.current;
  const size = shape.length;
  const rotated: number[][] = Array.from({ length: size }, () => Array(size).fill(0));
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      rotated[c][size - 1 - r] = shape[r][c];

  const newPiece = { ...state.current, shape: rotated };
  if (!collides(state.board, newPiece)) return { ...state, current: newPiece };

  // Wall kick: try shifting left/right
  for (const dx of [-1, 1, -2, 2]) {
    const kicked = { ...newPiece, pos: { ...newPiece.pos, x: newPiece.pos.x + dx } };
    if (!collides(state.board, kicked)) return { ...state, current: kicked };
  }
  return state;
}

export function getDropSpeed(level: number): number {
  return Math.max(100, 800 - (level - 1) * 70);
}
