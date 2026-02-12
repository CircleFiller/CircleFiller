import React, { useEffect, useRef } from 'react'
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native'
import { COLORS } from '../theme/colors'
import { Player, GameMode } from '../game/types'

interface GameOverModalProps {
  winner: Player | null // null = draw
  mode: GameMode
  moveCount: number
  onPlayAgain: () => void
  onHome: () => void
}

function GlowLine({ color, width = 60 }: { color: string; width?: number }) {
  const opacity = useRef(new Animated.Value(0.3)).current
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(opacity, { toValue: 0.8, duration: 1200, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0.3, duration: 1200, useNativeDriver: true }),
    ])).start()
  }, [])
  return (
    <Animated.View style={[styles.glowLine, { backgroundColor: color, width, opacity }]} />
  )
}

export function GameOverModal({ winner, mode, moveCount, onPlayAgain, onHome }: GameOverModalProps) {
  const isDraw = winner === null
  const isP1Win = winner === 1

  const title = isDraw ? 'DRAW' : isP1Win ? 'YOU WIN' : mode === 'ai' ? 'AI WINS' : 'P2 WINS'
  const icon = isDraw ? '⚡' : isP1Win ? '🏆' : '🤖'
  const accentColor = isDraw ? COLORS.warning : isP1Win ? COLORS.accent : COLORS.p1

  const fadeIn = useRef(new Animated.Value(0)).current
  const scaleIn = useRef(new Animated.Value(0.9)).current
  const titlePulse = useRef(new Animated.Value(0.7)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(scaleIn, { toValue: 1, tension: 80, friction: 8, useNativeDriver: true }),
    ]).start()

    Animated.loop(Animated.sequence([
      Animated.timing(titlePulse, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(titlePulse, { toValue: 0.7, duration: 600, useNativeDriver: true }),
    ])).start()
  }, [])

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeIn }]}>
      <Animated.View style={[
        styles.modal,
        { borderColor: accentColor, transform: [{ scale: scaleIn }] },
      ]}>
        {/* Top accent */}
        <View style={[styles.topAccent, { backgroundColor: accentColor }]} />

        {/* Icon */}
        <Text style={styles.icon}>{icon}</Text>

        {/* Decorative line */}
        <GlowLine color={accentColor} />

        {/* Result title */}
        <Animated.Text style={[styles.title, {
          color: accentColor,
          opacity: titlePulse,
          textShadowColor: accentColor,
        }]}>
          {title}
        </Animated.Text>

        {/* Stats */}
        <View style={styles.statsBox}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{moveCount}</Text>
            <Text style={styles.statLabel}>MOVES</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: accentColor }]} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{Math.ceil(moveCount / 2)}</Text>
            <Text style={styles.statLabel}>YOURS</Text>
          </View>
        </View>

        {/* Decorative line */}
        <GlowLine color={accentColor} width={40} />

        {/* Buttons */}
        <View style={styles.btnGroup}>
          <Pressable
            style={({ pressed }) => [
              styles.btn, styles.primaryBtn,
              { borderColor: accentColor, shadowColor: accentColor },
              pressed && { opacity: 0.7 },
            ]}
            onPress={onPlayAgain}
          >
            <Text style={[styles.btnText, { color: accentColor }]}>PLAY AGAIN</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.btn, styles.exitBtn,
              pressed && { opacity: 0.7 },
            ]}
            onPress={onHome}
          >
            <Text style={[styles.exitText]}>EXIT</Text>
          </Pressable>
        </View>

        {/* Bottom accent */}
        <View style={[styles.bottomAccent, { backgroundColor: accentColor }]} />
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 5, 12, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  modal: {
    backgroundColor: COLORS.bg,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 28,
    paddingHorizontal: 32,
    alignItems: 'center',
    minWidth: 280,
    overflow: 'hidden',
  },

  topAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    opacity: 0.6,
  },
  bottomAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    opacity: 0.3,
  },

  icon: {
    fontSize: 36,
    marginBottom: 8,
  },

  glowLine: {
    height: 1,
    borderRadius: 1,
    marginVertical: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 6,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginBottom: 14,
  },

  // ── Stats ──
  statsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 14,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '900',
  },
  statLabel: {
    color: COLORS.textDim,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 3,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    opacity: 0.2,
  },

  // ── Buttons ──
  btnGroup: {
    width: '100%',
    gap: 6,
    marginTop: 4,
  },
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  primaryBtn: {
    borderWidth: 1.5,
    backgroundColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 12,
    shadowOpacity: 0.5,
    elevation: 6,
  },
  btnText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 3,
  },
  exitBtn: {
    backgroundColor: 'transparent',
  },
  exitText: {
    color: COLORS.textDim,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 3,
  },
})
