import { Board, CellValue, Player, WinResult, MoveResult, ROWS, COLS, WIN_LENGTH } from './types'

export function createBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0) as CellValue[])
}

export function dropChip(board: Board, col: number, player: Player): MoveResult | null {
  if (col < 0 || col >= COLS) return null

  // Find the lowest empty row in this column
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][col] === 0) {
      const newBoard = board.map(r => [...r])
      newBoard[row][col] = player
      return { board: newBoard, row }
    }
  }
  return null // Column is full
}

export function getValidColumns(board: Board): number[] {
  const valid: number[] = []
  for (let col = 0; col < COLS; col++) {
    if (board[0][col] === 0) valid.push(col)
  }
  return valid
}

export function isBoardFull(board: Board): boolean {
  return getValidColumns(board).length === 0
}

export function checkWin(board: Board, row: number, col: number): WinResult | null {
  const player = board[row][col]
  if (player === 0) return null

  // Check all 4 directions from the last placed chip
  const directions: [number, number][] = [
    [0, 1],  // horizontal
    [1, 0],  // vertical
    [1, 1],  // diagonal down-right
    [1, -1], // diagonal down-left
  ]

  for (const [dr, dc] of directions) {
    const cells: [number, number][] = [[row, col]]

    // Count in positive direction
    for (let i = 1; i < WIN_LENGTH; i++) {
      const r = row + dr * i
      const c = col + dc * i
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || board[r][c] !== player) break
      cells.push([r, c])
    }

    // Count in negative direction
    for (let i = 1; i < WIN_LENGTH; i++) {
      const r = row - dr * i
      const c = col - dc * i
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || board[r][c] !== player) break
      cells.push([r, c])
    }

    if (cells.length >= WIN_LENGTH) {
      return { player: player as Player, cells: cells.slice(0, WIN_LENGTH) }
    }
  }

  return null
}

// Full board scan for win (used by AI evaluation)
export function findWin(board: Board): WinResult | null {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col] !== 0) {
        const result = checkWin(board, row, col)
        if (result) return result
      }
    }
  }
  return null
}
