import { useReducer, useCallback } from 'react'
import { GameState, GamePhase, Player, Difficulty, GameMode } from '../game/types'
import { createBoard, dropChip, checkWin, isBoardFull } from '../game/engine'

type Action =
  | { type: 'START'; mode: GameMode; difficulty: Difficulty }
  | { type: 'MOVE'; col: number }
  | { type: 'RESET' }
  | { type: 'MENU' }

const INITIAL_STATE: GameState = {
  board: createBoard(),
  currentPlayer: 1,
  phase: 'menu',
  winner: null,
  winningCells: [],
  moveCount: 0,
  mode: 'ai',
  difficulty: 'medium',
  scores: { p1: 0, p2: 0 },
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'START':
      return {
        ...INITIAL_STATE,
        phase: 'playing',
        mode: action.mode,
        difficulty: action.difficulty,
        scores: state.scores,
      }

    case 'MOVE': {
      if (state.phase !== 'playing') return state

      const result = dropChip(state.board, action.col, state.currentPlayer)
      if (!result) return state

      const win = checkWin(result.board, result.row, action.col)
      const draw = !win && isBoardFull(result.board)
      const newMoveCount = state.moveCount + 1

      if (win) {
        return {
          ...state,
          board: result.board,
          phase: 'won',
          winner: win.player,
          winningCells: win.cells,
          moveCount: newMoveCount,
          scores: {
            p1: state.scores.p1 + (win.player === 1 ? 1 : 0),
            p2: state.scores.p2 + (win.player === 2 ? 1 : 0),
          },
        }
      }

      if (draw) {
        return {
          ...state,
          board: result.board,
          phase: 'draw',
          moveCount: newMoveCount,
        }
      }

      return {
        ...state,
        board: result.board,
        currentPlayer: (state.currentPlayer === 1 ? 2 : 1) as Player,
        moveCount: newMoveCount,
      }
    }

    case 'RESET':
      return {
        ...INITIAL_STATE,
        phase: 'playing',
        mode: state.mode,
        difficulty: state.difficulty,
        scores: state.scores,
      }

    case 'MENU':
      return {
        ...INITIAL_STATE,
        scores: state.scores,
      }

    default:
      return state
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  const startGame = useCallback((mode: GameMode, difficulty: Difficulty) => {
    dispatch({ type: 'START', mode, difficulty })
  }, [])

  const makeMove = useCallback((col: number) => {
    dispatch({ type: 'MOVE', col })
  }, [])

  const goToMenu = useCallback(() => {
    dispatch({ type: 'MENU' })
  }, [])

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  return { state, startGame, makeMove, goToMenu, resetGame }
}
