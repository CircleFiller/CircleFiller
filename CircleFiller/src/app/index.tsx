import React, { useEffect, useRef } from 'react'
import { View, Text, Image, StyleSheet, SafeAreaView, ScrollView, Animated } from 'react-native'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { COLORS } from '../theme/colors'
import { GameMode, Difficulty } from '../game/types'
import { ModeSelector } from '../components/ModeSelector'

function CRTScanlines() {
  return (
    <View style={styles.scanlines} pointerEvents="none">
      {Array.from({ length: 350 }).map((_, i) => (
        <View key={i} style={styles.scanlineRow} />
      ))}
    </View>
  )
}

function CRTVignette() {
  return <View style={styles.vignette} pointerEvents="none" />
}

export default function HomeScreen() {
  const router = useRouter()
  const titleGlow = useRef(new Animated.Value(0.6)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(titleGlow, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(titleGlow, { toValue: 0.6, duration: 2000, useNativeDriver: true }),
      ])
    ).start()
  }, [])

  const handleStart = (mode: GameMode, difficulty: Difficulty) => {
    router.push({ pathname: '/game', params: { mode, difficulty } })
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} bounces={false}>
        {/* ── LOGO ── */}
        <Image
          source={require('../../assets/icons/icon-96.png')}
          style={styles.logo}
        />

        {/* ── TITLE BLOCK ── */}
        <Animated.View style={[styles.titleBlock, { opacity: titleGlow }]}>
          <Text style={styles.titleLine1}>CIRCLE</Text>
          <Text style={styles.titleLine2}>FILLER</Text>
        </Animated.View>

        {/* Presents */}
        <Text style={styles.presentsText}>Presents:</Text>

        {/* Subtitle / tagline */}
        <View style={styles.tagRow}>
          <View style={styles.tagLine} />
          <Text style={styles.tagText}>4 - IN - A - ROW</Text>
          <View style={styles.tagLine} />
        </View>

        {/* ── CREDIT LINE ── */}
        <View style={styles.creditRow}>
          <View style={[styles.creditDot, { backgroundColor: COLORS.p1 }]} />
          <View style={[styles.creditDot, { backgroundColor: COLORS.p2 }]} />
          <View style={[styles.creditDot, { backgroundColor: COLORS.accent }]} />
          <View style={[styles.creditDot, { backgroundColor: COLORS.win }]} />
        </View>

        {/* ── MODE SELECTOR ── */}
        <ModeSelector onStart={handleStart} />

        {/* ── FOOTER ── */}
        <View style={styles.footer}>
          <View style={styles.footerRule} />
          <Text style={styles.footerText}>POWERED BY SOLANA</Text>
          <Text style={styles.footerVersion}>SEEKER EDITION v1.0</Text>
        </View>
      </ScrollView>

      {/* ── MOTTO (pinned to bottom) ── */}
      <Text style={styles.mottoText}>You have circles, we fill them.</Text>

      {/* CRT overlay effects */}
      <CRTScanlines />
      <CRTVignette />

      <StatusBar style="light" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 20,
  },

  // ── Logo ──
  logo: {
    width: 96,
    height: 96,
    marginBottom: -8,
    marginTop: -12,
  },

  // ── Title ──
  titleBlock: {
    alignItems: 'center',
  },
  titleLine1: {
    color: COLORS.text,
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 14,
    paddingLeft: 14,
    textShadowColor: COLORS.accentDim,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 30,
  },
  titleLine2: {
    color: COLORS.accent,
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 14,
    paddingLeft: 14,
    marginTop: -10,
    textShadowColor: COLORS.accent,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 40,
  },

  // ── Tagline ──
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tagLine: {
    width: 28,
    height: 1,
    backgroundColor: COLORS.accent,
    opacity: 0.6,
  },
  tagText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 6,
    paddingLeft: 6,
  },

  // ── Credit dots ──
  creditRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  creditDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.6,
  },
  mottoText: {
    color: '#ff4d7a',
    fontSize: 11,
    fontStyle: 'italic',
    fontWeight: '600',
    letterSpacing: 1,
    textAlign: 'center',
    paddingBottom: 12,
  },
  presentsText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    paddingLeft: 3,
  },

  // ── Footer ──
  footer: {
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  footerRule: {
    width: 40,
    height: 1,
    backgroundColor: COLORS.accent,
    marginBottom: 4,
    opacity: 0.5,
  },
  footerText: {
    color: COLORS.accent,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 4,
    opacity: 0.7,
    textShadowColor: COLORS.accent,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  footerVersion: {
    color: '#ff4d7a',
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 2,
    opacity: 0.6,
  },

  // ── CRT Effects ──
  scanlines: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  scanlineRow: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    marginBottom: 2,
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 0,
    borderWidth: 40,
    borderColor: 'rgba(0,0,0,0.25)',
    // Fake vignette via thick transparent-ish border
    opacity: 1,
  },
})
