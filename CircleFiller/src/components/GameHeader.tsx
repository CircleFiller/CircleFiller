import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
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

function ThinkingPulse() {
  const opacity = useRef(new Animated.Value(0.3)).current
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 400, useNativeDriver: true }),
      ])
    ).start()
  }, [])
  return (
    <Animated.Text style={[styles.centerLabel, { color: COLORS.p2, opacity }]}>
      THINKING
    </Animated.Text>
  )
}

function PlayerSide({ label, color, score, active, flip }: {
  label: string; color: string; score: number; active: boolean; flip?: boolean
}) {
  const glowAnim = useRef(new Animated.Value(0.4)).current

  useEffect(() => {
    if (active) {
      Animated.loop(Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 600, useNativeDriver: false }),
        Animated.timing(glowAnim, { toValue: 0.4, duration: 600, useNativeDriver: false }),
      ])).start()
    } else {
      glowAnim.stopAnimation()
      glowAnim.setValue(0.4)
    }
  }, [active])

  return (
    <View style={[styles.side, flip && styles.sideFlip]}>
      {/* Chip indicator */}
      <Animated.View style={[
        styles.chip,
        {
          backgroundColor: color,
          shadowColor: color,
          shadowOpacity: active ? glowAnim : 0,
          shadowRadius: active ? 10 : 0,
        },
      ]} />

      {/* Name + score */}
      <View style={[styles.sideText, flip && styles.sideTextFlip]}>
        <Text style={[
          styles.playerName,
          { color: active ? color : COLORS.textDim },
          active && { textShadowColor: color, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 8 },
        ]}>
          {label}
        </Text>
        <Text style={[
          styles.scoreText,
          { color },
          active && { textShadowColor: color, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 12 },
        ]}>
          {score}
        </Text>
      </View>

      {/* Active indicator line */}
      {active && <View style={[styles.activeLine, { backgroundColor: color }]} />}
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
      {/* P1 — left aligned */}
      <PlayerSide label={p1Label} color={COLORS.accent} score={scores.p1} active={p1Active} />

      {/* Center — move counter + difficulty */}
      <View style={styles.center}>
        {aiThinking ? (
          <ThinkingPulse />
        ) : (
          <Text style={styles.centerLabel}>MOVE {moveCount + 1}</Text>
        )}
        {mode === 'ai' && (
          <Text style={[styles.diffTag, { color: diffColor, textShadowColor: diffColor }]}>
            {difficulty.toUpperCase()}
          </Text>
        )}
      </View>

      {/* P2 — right aligned */}
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
    paddingTop: 16,
    paddingBottom: 12,
  },

  // ── Player side ──
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
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  playerName: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: '900',
    marginTop: -2,
  },
  activeLine: {
    position: 'absolute',
    bottom: -6,
    left: 0,
    right: 0,
    height: 1,
    opacity: 0.6,
  },

  // ── Center ──
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
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
})
