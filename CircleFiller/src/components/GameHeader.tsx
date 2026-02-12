import React from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'
import { COLORS } from '../theme/colors'
import { Player, GameMode, Difficulty } from '../game/types'

interface GameHeaderProps {
  currentPlayer: Player
  mode: GameMode
  difficulty: Difficulty
  scores: { p1: number; p2: number }
  moveCount: number
  aiThinking?: boolean
}

function PlayerSide({ label, color, score, active, flip }: {
  label: string; color: string; score: number; active: boolean; flip?: boolean
}) {
  const shadow = active && Platform.OS === 'web'
    ? { textShadow: `0 0 8px ${color}` } as any
    : undefined

  return (
    <View style={[styles.side, flip && styles.sideFlip]}>
      <View style={[styles.chip, { backgroundColor: color }]} />
      <View style={[styles.sideText, flip && styles.sideTextFlip]}>
        <Text style={[
          styles.playerName,
          { color: active ? color : COLORS.textDim },
          shadow,
        ]}>
          {label}
        </Text>
        <Text style={[styles.scoreText, { color }, shadow]}>
          {score}
        </Text>
      </View>
    </View>
  )
}

export function GameHeader({ currentPlayer, mode, difficulty, scores, moveCount, aiThinking }: GameHeaderProps) {
  const p1Active = currentPlayer === 1
  const p2Active = currentPlayer === 2
  const p1Label = mode === 'ai' ? 'YOU' : 'P1'
  const p2Label = mode === 'ai' ? 'AI' : 'P2'

  const diffColor = difficulty === 'easy' ? COLORS.accent
    : difficulty === 'medium' ? COLORS.p1
    : '#b44dff'

  return (
    <View style={styles.container}>
      <PlayerSide label={p1Label} color={COLORS.accent} score={scores.p1} active={p1Active} />

      <View style={styles.center}>
        <Text style={styles.centerLabel}>
          {aiThinking ? 'THINKING' : `MOVE ${moveCount + 1}`}
        </Text>
        {mode === 'ai' && (
          <Text style={[styles.diffTag, { color: diffColor }]}>
            {difficulty.toUpperCase()}
          </Text>
        )}
      </View>

      <PlayerSide label={p2Label} color={COLORS.p1} score={scores.p2} active={p2Active} flip />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 12,
  },
  side: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 90,
  },
  sideFlip: {
    flexDirection: 'row-reverse',
  },
  sideText: {
    alignItems: 'flex-start',
  },
  sideTextFlip: {
    alignItems: 'flex-end',
  },
  chip: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  playerName: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: '900',
    marginTop: -2,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    color: COLORS.textDim,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 3,
  },
  diffTag: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 3,
  },
})
