import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Pressable, StyleSheet, Animated, Dimensions } from 'react-native'
import { COLORS } from '../theme/colors'
import { Difficulty, GameMode } from '../game/types'

const { width: SCREEN_W } = Dimensions.get('window')
const CARD_GAP = 10
const H_PAD = 20
const CARD_W = (SCREEN_W - H_PAD * 2 - CARD_GAP * 2) / 3

interface ModeSelectorProps {
  onStart: (mode: GameMode, difficulty: Difficulty) => void
}

function PulseText({ text, color }: { text: string; color: string }) {
  const opacity = useRef(new Animated.Value(0.3)).current
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 600, useNativeDriver: true }),
      ])
    ).start()
  }, [])
  return (
    <Animated.Text style={[styles.pulseText, { color, opacity }]}>
      {text}
    </Animated.Text>
  )
}

function ModeCard({ icon, title, subtitle, color, active, disabled, onPress }: {
  icon: string; title: string; subtitle: string; color: string
  active?: boolean; disabled?: boolean; onPress: () => void
}) {
  const glow = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    if (active) {
      Animated.loop(Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 800, useNativeDriver: false }),
        Animated.timing(glow, { toValue: 0.4, duration: 800, useNativeDriver: false }),
      ])).start()
    } else {
      glow.stopAnimation()
      glow.setValue(0.3)
    }
  }, [active])

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        pressed && !disabled && { opacity: 0.75 },
      ]}
    >
      <Animated.View style={[
        styles.card,
        {
          borderColor: color,
          shadowColor: color,
          shadowOpacity: active ? glow : 0.3,
          shadowRadius: active ? 18 : 8,
        },
        disabled && styles.cardDisabled,
      ]}>
        {/* Inner border glow */}
        <View style={[styles.innerBorder, { borderColor: color + '25' }]} />

        {/* Top accent line */}
        <View style={[styles.topAccent, { backgroundColor: color }]} />

        {/* Icon */}
        <Text style={styles.cardIcon}>{icon}</Text>

        {/* Divider */}
        <View style={[styles.cardDivider, { backgroundColor: color + '30' }]} />

        {/* Title */}
        <Text style={[styles.cardTitle, { textShadowColor: color }]}>{title}</Text>

        {/* Subtitle */}
        {subtitle ? (
          <Text style={[styles.cardSub, disabled && { color: COLORS.textDim }]}>{subtitle}</Text>
        ) : null}

        {/* Bottom accent line */}
        <View style={[styles.bottomAccent, { backgroundColor: color }]} />
      </Animated.View>
    </Pressable>
  )
}

export function ModeSelector({ onStart }: ModeSelectorProps) {
  const [showDiff, setShowDiff] = useState(false)

  return (
    <View style={styles.container}>
      {/* Three cards side by side */}
      <View style={styles.cardRow}>
        <ModeCard
          icon="🤖"
          title="VS AI"
          subtitle=""
          color={COLORS.accent}
          active={showDiff}
          onPress={() => setShowDiff(prev => !prev)}
        />
        <ModeCard
          icon="👥"
          title="1 V 1"
          subtitle="SOON"
          color={COLORS.p1}
          disabled
          onPress={() => {}}
        />
        <ModeCard
          icon="🏆"
          title="BATTLE"
          subtitle="SOON"
          color={COLORS.p2}
          disabled
          onPress={() => {}}
        />
      </View>

      {/* Difficulty selector */}
      {showDiff && (
        <View style={styles.diffRow}>
          {([
            { key: 'easy' as Difficulty, label: 'EASY', color: COLORS.accent },
            { key: 'medium' as Difficulty, label: 'NORMAL', color: COLORS.p1 },
            { key: 'hard' as Difficulty, label: 'BRUTAL', color: '#b44dff' },
          ]).map((d) => (
            <Pressable
              key={d.key}
              style={({ pressed }) => [
                styles.diffBtn,
                { borderColor: d.color + '40', shadowColor: d.color },
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => onStart('ai', d.key)}
            >
              <Text style={[styles.diffLabel, { color: d.color, textShadowColor: d.color }]}>
                {d.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Pulsing prompt */}
      <View style={styles.promptRow}>
        <PulseText text="▸ SELECT MODE ◂" color={COLORS.accent} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: H_PAD,
    gap: 12,
  },

  // ── Card grid ──
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: CARD_GAP,
  },

  // ── Card — square-ish, compact ──
  card: {
    width: CARD_W,
    aspectRatio: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingVertical: 10,
    paddingHorizontal: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
    overflow: 'hidden',
    gap: 4,
  },
  cardDisabled: {
    opacity: 0.4,
  },

  innerBorder: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: 3,
    bottom: 3,
    borderRadius: 9,
    borderWidth: 1,
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

  cardIcon: {
    fontSize: 26,
    textAlign: 'center',
  },
  cardDivider: {
    width: 20,
    height: 1,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 3,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
    textAlign: 'center',
  },
  cardSub: {
    color: COLORS.textDim,
    fontSize: 7,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
  },

  // ── Difficulty ──
  diffRow: {
    flexDirection: 'row',
    gap: CARD_GAP,
  },
  diffBtn: {
    flex: 1,
    backgroundColor: COLORS.bg,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.4,
    elevation: 4,
  },
  diffLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },

  // ── Pulse ──
  promptRow: {
    alignItems: 'center',
    marginTop: 2,
  },
  pulseText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 4,
  },
})
