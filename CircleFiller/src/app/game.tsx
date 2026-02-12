import React, { useCallback, useEffect, useRef } from 'react'
import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { COLORS } from '../theme/colors'
import { GameMode, Difficulty } from '../game/types'
import { useGame } from '../hooks/useGame'
import { useAI } from '../hooks/useAI'
import { useSound } from '../hooks/useSound'
import { Board } from '../components/Board'
import { GameHeader } from '../components/GameHeader'
import { GameOverModal } from '../components/GameOverModal'

function CRTScanlines() {
  return (
    <View style={styles.scanlines} pointerEvents="none">
      {Array.from({ length: 350 }).map((_, i) => (
        <View key={i} style={styles.scanlineRow} />
      ))}
    </View>
  )
}

export default function GameScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ mode?: string; difficulty?: string }>()
  const { playDrop, playWin } = useSound()

  const mode = (params.mode as GameMode) || 'ai'
  const difficulty = (params.difficulty as Difficulty) || 'medium'

  const { state, startGame, makeMove, goToMenu, resetGame } = useGame()
  const prevPhaseRef = useRef(state.phase)
  const prevMoveRef = useRef(state.moveCount)

  // Auto-start game from params
  useEffect(() => {
    if (state.phase === 'menu') {
      startGame(mode, difficulty)
    }
  }, []) // Only on mount

  // Play sounds on state changes
  useEffect(() => {
    if (state.moveCount > prevMoveRef.current) {
      playDrop()
    }
    prevMoveRef.current = state.moveCount
  }, [state.moveCount, playDrop])

  useEffect(() => {
    if (state.phase === 'won' && prevPhaseRef.current === 'playing') {
      setTimeout(playWin, 300)
    }
    prevPhaseRef.current = state.phase
  }, [state.phase, playWin])

  const handleColumnPress = useCallback((col: number) => {
    makeMove(col)
  }, [makeMove])

  const { isThinking } = useAI({
    board: state.board,
    currentPlayer: state.currentPlayer,
    isPlaying: state.phase === 'playing',
    isAIMode: state.mode === 'ai',
    aiPlayer: 2,
    difficulty: state.difficulty,
    onMove: handleColumnPress,
  })

  const isPlayerTurn = state.phase === 'playing' && !isThinking
  const gameOver = state.phase === 'won' || state.phase === 'draw'

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Top bar ── */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => { goToMenu(); router.replace('/') }}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
        >
          <View style={styles.backIcon}>
            <View style={styles.backChevronTop} />
            <View style={styles.backChevronBot} />
          </View>
          <Text style={styles.backLabel}>EXIT</Text>
        </Pressable>

        <Text style={styles.titleText}>CIRCLE FILLER</Text>

        <View style={styles.topBarRight} />
      </View>

      {/* Thin neon separator */}
      <View style={styles.separator} />

      {/* ── Player header ── */}
      <GameHeader
        currentPlayer={state.currentPlayer}
        mode={state.mode}
        difficulty={state.difficulty}
        scores={state.scores}
        moveCount={state.moveCount}
        aiThinking={isThinking}
      />

      {/* ── Board ── */}
      <View style={styles.boardContainer}>
        <Board
          board={state.board}
          winningCells={state.winningCells}
          onColumnPress={handleColumnPress}
          disabled={!isPlayerTurn}
        />
      </View>

      {/* ── Game over modal ── */}
      {gameOver && (
        <GameOverModal
          winner={state.winner}
          mode={state.mode}
          moveCount={state.moveCount}
          onPlayAgain={resetGame}
          onHome={() => {
            goToMenu()
            router.replace('/')
          }}
        />
      )}

      {/* CRT overlay — excluded from game screen, interferes with board visibility */}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  // ── Top bar ──
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 44,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    paddingHorizontal: 4,
    minWidth: 70,
  },
  backIcon: {
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backChevronTop: {
    width: 8,
    height: 1.5,
    backgroundColor: COLORS.accent,
    borderRadius: 1,
    transform: [{ rotate: '-45deg' }, { translateY: 2 }],
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
    shadowOpacity: 0.8,
  },
  backChevronBot: {
    width: 8,
    height: 1.5,
    backgroundColor: COLORS.accent,
    borderRadius: 1,
    transform: [{ rotate: '45deg' }, { translateY: -2 }],
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
    shadowOpacity: 0.8,
  },
  backLabel: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: COLORS.accent,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  titleText: {
    color: COLORS.text,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 5,
    textShadowColor: COLORS.accent,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  topBarRight: {
    minWidth: 70,
  },

  separator: {
    height: 1,
    backgroundColor: COLORS.cellBorder,
    marginHorizontal: 16,
    opacity: 0.5,
  },

  // ── Board ──
  boardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  // ── CRT ──
  scanlines: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  scanlineRow: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    marginBottom: 2,
  },
})
