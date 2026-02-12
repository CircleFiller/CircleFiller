// useSound.ts — native: sound effects via expo-av
import { useRef, useEffect, useCallback } from 'react'
import { Audio } from 'expo-av'

// Pre-generate WAV data for chip drop sound
// Simulates a plastic chip sliding down through the board grid:
// rapid descending clicks (bouncing past rows) + final landing thock
function generateDropWav(): ArrayBuffer {
  const sampleRate = 22050
  const duration = 0.15
  const numSamples = Math.floor(sampleRate * duration)
  const buffer = new ArrayBuffer(44 + numSamples * 2)
  const view = new DataView(buffer)

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i))
  }
  writeString(0, 'RIFF')
  view.setUint32(4, 36 + numSamples * 2, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeString(36, 'data')
  view.setUint32(40, numSamples * 2, true)

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate
    let sample = 0

    // Phase 1 (0-80ms): smooth downward slide — filtered noise sweep
    if (t < 0.08) {
      const slideProgress = t / 0.08
      const slideEnv = 0.12 + slideProgress * 0.15
      const freq = 3500 - slideProgress * 2000
      const tone = Math.sin(2 * Math.PI * freq * t) * 0.4
      const noise = (Math.random() * 2 - 1) * 0.6
      sample = (tone + noise) * slideEnv
    }

    // Phase 2 (80ms): crisp landing snap
    const snapT = t - 0.075
    if (snapT > 0 && snapT < 0.025) {
      const snapEnv = Math.exp(-snapT * 160)
      sample += Math.sin(2 * Math.PI * 1800 * snapT) * snapEnv * 0.55
      sample += Math.sin(2 * Math.PI * 1200 * snapT) * snapEnv * 0.3
      sample += (Math.random() * 2 - 1) * snapEnv * 0.15
    }

    // Phase 3: very brief low settle
    const settleT = t - 0.085
    if (settleT > 0 && settleT < 0.06) {
      const settleEnv = Math.exp(-settleT * 50)
      sample += Math.sin(2 * Math.PI * 500 * settleT) * settleEnv * 0.12
    }

    const clamped = Math.max(-1, Math.min(1, sample))
    view.setInt16(44 + i * 2, clamped * 32767, true)
  }

  return buffer
}

// Win jingle — ascending arpeggio
function generateWinWav(): ArrayBuffer {
  const sampleRate = 22050
  const duration = 0.6
  const numSamples = Math.floor(sampleRate * duration)
  const buffer = new ArrayBuffer(44 + numSamples * 2)
  const view = new DataView(buffer)

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i))
  }
  writeString(0, 'RIFF')
  view.setUint32(4, 36 + numSamples * 2, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeString(36, 'data')
  view.setUint32(40, numSamples * 2, true)

  // Ascending notes: C5, E5, G5, C6
  const notes = [523.25, 659.25, 783.99, 1046.5]
  const noteLen = duration / notes.length

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate
    const noteIdx = Math.min(Math.floor(t / noteLen), notes.length - 1)
    const noteT = t - noteIdx * noteLen
    const freq = notes[noteIdx]
    const env = Math.exp(-noteT * 4) * 0.6
    const sample = Math.sin(2 * Math.PI * freq * t) * env
    const clamped = Math.max(-1, Math.min(1, sample))
    view.setInt16(44 + i * 2, clamped * 32767, true)
  }

  return buffer
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

export function useSound() {
  const dropSoundRef = useRef<Audio.Sound | null>(null)
  const winSoundRef = useRef<Audio.Sound | null>(null)
  const loaded = useRef(false)

  useEffect(() => {
    let mounted = true

    const loadSounds = async () => {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true })

        const dropWav = generateDropWav()
        const dropB64 = arrayBufferToBase64(dropWav)
        const { sound: dropSound } = await Audio.Sound.createAsync(
          { uri: `data:audio/wav;base64,${dropB64}` },
          { shouldPlay: false }
        )

        const winWav = generateWinWav()
        const winB64 = arrayBufferToBase64(winWav)
        const { sound: winSound } = await Audio.Sound.createAsync(
          { uri: `data:audio/wav;base64,${winB64}` },
          { shouldPlay: false }
        )

        if (mounted) {
          dropSoundRef.current = dropSound
          winSoundRef.current = winSound
          loaded.current = true
        }
      } catch (e) {
        console.warn('Sound init failed:', e)
      }
    }

    loadSounds()
    return () => {
      mounted = false
      dropSoundRef.current?.unloadAsync()
      winSoundRef.current?.unloadAsync()
    }
  }, [])

  const playDrop = useCallback(async () => {
    try {
      if (dropSoundRef.current) {
        await dropSoundRef.current.setPositionAsync(0)
        await dropSoundRef.current.playAsync()
      }
    } catch {}
  }, [])

  const playWin = useCallback(async () => {
    try {
      if (winSoundRef.current) {
        await winSoundRef.current.setPositionAsync(0)
        await winSoundRef.current.playAsync()
      }
    } catch {}
  }, [])

  return { playDrop, playWin }
}
