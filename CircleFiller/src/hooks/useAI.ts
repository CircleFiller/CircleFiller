import { useRef, useCallback, useEffect } from 'react'
import { Board, Player, Difficulty } from '../game/types'
import { getBestMove, getAIDelay } from '../game/ai'

interface UseAIProps {
  board: Board
  currentPlayer: Player
  isPlaying: boolean
  isAIMode: boolean
  aiPlayer: Player
  difficulty: Difficulty
  onMove: (col: number) => void
}

export function useAI({ board, currentPlayer, isPlaying, isAIMode, aiPlayer, difficulty, onMove }: UseAIProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const thinkingRef = useRef(false)

  const isAITurn = isPlaying && isAIMode && currentPlayer === aiPlayer

  useEffect(() => {
    if (!isAITurn) {
      thinkingRef.current = false
      return
    }

    thinkingRef.current = true
    const delay = getAIDelay(difficulty)

    // Run AI computation after a delay (simulates "thinking")
    timerRef.current = setTimeout(() => {
      const col = getBestMove(board, aiPlayer, difficulty)
      if (col >= 0 && thinkingRef.current) {
        onMove(col)
      }
      thinkingRef.current = false
    }, delay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      thinkingRef.current = false
    }
  }, [isAITurn, board, aiPlayer, difficulty, onMove])

  return { isThinking: isAITurn }
}
