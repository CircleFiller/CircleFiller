// Game types for Connect 4

export const ROWS = 6
export const COLS = 7
export const WIN_LENGTH = 4

export type Player = 1 | 2
export type CellValue = 0 | Player
export type Board = CellValue[][]

export type Difficulty = 'easy' | 'medium' | 'hard'
export type GameMode = 'ai' | 'local'

export interface WinResult {
  player: Player
  cells: [number, number][] // [row, col] pairs for the 4 winning cells
}

export interface MoveResult {
  board: Board
  row: number
}

export type GamePhase = 'menu' | 'playing' | 'won' | 'draw'

export interface GameState {
  board: Board
  currentPlayer: Player
  phase: GamePhase
  winner: Player | null
  winningCells: [number, number][]
  moveCount: number
  mode: GameMode
  difficulty: Difficulty
  scores: { p1: number; p2: number }
}
