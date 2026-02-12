import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native'
import { COLORS } from '../theme/colors'
import { Difficulty, GameMode } from '../game/types'

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
        styles.cardWrapper,
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

        {/* Fixed-position icon slot */}
        <View style={styles.iconSlot}>
          <Text style={styles.cardIcon}>{icon}</Text>
        </View>

        {/* Divider */}
        <View style={[styles.cardDivider, { backgroundColor: color + '30' }]} />

        {/* Title */}
        <Text style={[styles.cardTitle, { textShadowColor: color }]}>{title}</Text>

        {/* Subtitle — fixed height slot so cards match regardless of content */}
        <View style={styles.subSlot}>
          {subtitle ? (
            <Text style={[styles.cardSub, disabled && { color: COLORS.textDim }]}>{subtitle}</Text>
          ) : null}
        </View>

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
      {/* Two cards side by side — identical size */}
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
          subtitle="COMING SOON"
          color={COLORS.p1}
          disabled
          onPress={() => {}}
        />
        <ModeCard
          icon="🏆"
          title="BATTLE"
          subtitle="COMING SOON"
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
    paddingHorizontal: 24,
    gap: 14,
  },

  // ── Card grid ──
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },

  cardWrapper: {
    flex: 1,
  },

  // ── Card — fixed structure, identical for both ──
  card: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bg,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 16,
    paddingHorizontal: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
    overflow: 'hidden',
  },
  cardDisabled: {
    opacity: 0.4,
  },

  innerBorder: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
    borderRadius: 10,
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

  iconSlot: {
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIcon: {
    fontSize: 30,
    lineHeight: 36,
    textAlign: 'center',
  },
  cardDivider: {
    width: 24,
    height: 1,
    marginVertical: 10,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 4,
    marginTop: 2,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
    textAlign: 'center',
  },
  subSlot: {
    height: 18,
    justifyContent: 'center',
  },
  cardSub: {
    color: COLORS.textDim,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 3,
    textAlign: 'center',
  },

  // ── Difficulty ──
  diffRow: {
    flexDirection: 'row',
    gap: 12,
  },
  diffBtn: {
    flex: 1,
    backgroundColor: COLORS.bg,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.4,
    elevation: 4,
  },
  diffLabel: {
    fontSize: 11,
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
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 5,
  },
})
