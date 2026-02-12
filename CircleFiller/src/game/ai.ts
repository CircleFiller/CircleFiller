import { Board, Player, Difficulty, ROWS, COLS, WIN_LENGTH } from './types'
import { dropChip, getValidColumns, findWin, isBoardFull } from './engine'

// Column evaluation order: center first for better alpha-beta pruning
const COL_ORDER = [3, 2, 4, 1, 5, 0, 6]

const DEPTH_MAP: Record<Difficulty, number> = {
  easy: 2,
  medium: 4,
  hard: 6,
}

const RANDOM_CHANCE: Record<Difficulty, number> = {
  easy: 0.3,    // 30% random moves
  medium: 0.1,  // 10% random moves
  hard: 0,      // Pure minimax
}

const DELAY_MAP: Record<Difficulty, number> = {
  easy: 800,
  medium: 500,
  hard: 300,
}

export function getAIDelay(difficulty: Difficulty): number {
  return DELAY_MAP[difficulty]
}

export function getBestMove(board: Board, aiPlayer: Player, difficulty: Difficulty): number {
  const valid = getValidColumns(board)
  if (valid.length === 0) return -1

  // Random move chance based on difficulty
  if (Math.random() < RANDOM_CHANCE[difficulty]) {
    return valid[Math.floor(Math.random() * valid.length)]
  }

  const depth = DEPTH_MAP[difficulty]
  const opponent: Player = aiPlayer === 1 ? 2 : 1

  let bestScore = -Infinity
  let bestCol = valid[0]

  for (const col of COL_ORDER) {
    if (!valid.includes(col)) continue

    const result = dropChip(board, col, aiPlayer)
    if (!result) continue

    const score = minimax(result.board, depth - 1, -Infinity, Infinity, false, aiPlayer, opponent)

    if (score > bestScore) {
      bestScore = score
      bestCol = col
    }
  }

  return bestCol
}

function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  opponent: Player,
): number {
  // Terminal checks
  const win = findWin(board)
  if (win) {
    return win.player === aiPlayer ? 100000 + depth : -100000 - depth
  }
  if (isBoardFull(board) || depth === 0) {
    return evaluateBoard(board, aiPlayer, opponent)
  }

  const valid = getValidColumns(board)

  if (isMaximizing) {
    let maxScore = -Infinity
    for (const col of COL_ORDER) {
      if (!valid.includes(col)) continue
      const result = dropChip(board, col, aiPlayer)
      if (!result) continue
      const score = minimax(result.board, depth - 1, alpha, beta, false, aiPlayer, opponent)
      maxScore = Math.max(maxScore, score)
      alpha = Math.max(alpha, score)
      if (beta <= alpha) break
    }
    return maxScore
  } else {
    let minScore = Infinity
    for (const col of COL_ORDER) {
      if (!valid.includes(col)) continue
      const result = dropChip(board, col, opponent)
      if (!result) continue
      const score = minimax(result.board, depth - 1, alpha, beta, true, aiPlayer, opponent)
      minScore = Math.min(minScore, score)
      beta = Math.min(beta, score)
      if (beta <= alpha) break
    }
    return minScore
  }
}

function evaluateBoard(board: Board, aiPlayer: Player, opponent: Player): number {
  let score = 0

  // Center column preference
  const centerCol = Math.floor(COLS / 2)
  for (let row = 0; row < ROWS; row++) {
    if (board[row][centerCol] === aiPlayer) score += 30
  }

  // Evaluate all windows of 4
  // Horizontal
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col <= COLS - WIN_LENGTH; col++) {
      score += evaluateWindow(
        [board[row][col], board[row][col + 1], board[row][col + 2], board[row][col + 3]],
        aiPlayer,
        opponent,
      )
    }
  }

  // Vertical
  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row <= ROWS - WIN_LENGTH; row++) {
      score += evaluateWindow(
        [board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col]],
        aiPlayer,
        opponent,
      )
    }
  }

  // Diagonal down-right
  for (let row = 0; row <= ROWS - WIN_LENGTH; row++) {
    for (let col = 0; col <= COLS - WIN_LENGTH; col++) {
      score += evaluateWindow(
        [board[row][col], board[row + 1][col + 1], board[row + 2][col + 2], board[row + 3][col + 3]],
        aiPlayer,
        opponent,
      )
    }
  }

  // Diagonal down-left
  for (let row = 0; row <= ROWS - WIN_LENGTH; row++) {
    for (let col = WIN_LENGTH - 1; col < COLS; col++) {
      score += evaluateWindow(
        [board[row][col], board[row + 1][col - 1], board[row + 2][col - 2], board[row + 3][col - 3]],
        aiPlayer,
        opponent,
      )
    }
  }

  return score
}

function evaluateWindow(window: number[], aiPlayer: Player, opponent: Player): number {
  const aiCount = window.filter(c => c === aiPlayer).length
  const oppCount = window.filter(c => c === opponent).length
  const emptyCount = window.filter(c => c === 0).length

  if (aiCount === 4) return 100000
  if (oppCount === 4) return -100000
  if (aiCount === 3 && emptyCount === 1) return 50
  if (aiCount === 2 && emptyCount === 2) return 10
  if (oppCount === 3 && emptyCount === 1) return -80 // Prioritize blocking
  if (oppCount === 2 && emptyCount === 2) return -15

  return 0
}
