// useSound.ts — native: sound effects via expo-av with bundled audio files
import { useRef, useEffect, useCallback } from 'react'
import { Audio } from 'expo-av'

// Bundled audio files (Metro resolves require() at build time)
const DROP_SOUND = require('../../assets/sounds/chip_drop.wav')
const POP_SOUND = require('../../assets/sounds/chip_pop.wav')

export function useSound() {
  const dropSoundRef = useRef<Audio.Sound | null>(null)
  const popSoundRef = useRef<Audio.Sound | null>(null)
  const loaded = useRef(false)

  useEffect(() => {
    let mounted = true

    const loadSounds = async () => {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true })

        const { sound: dropSound } = await Audio.Sound.createAsync(
          DROP_SOUND,
          { shouldPlay: false }
        )

        const { sound: popSound } = await Audio.Sound.createAsync(
          POP_SOUND,
          { shouldPlay: false }
        )

        if (mounted) {
          dropSoundRef.current = dropSound
          popSoundRef.current = popSound
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
      popSoundRef.current?.unloadAsync()
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
      if (popSoundRef.current) {
        await popSoundRef.current.setPositionAsync(0)
        await popSoundRef.current.playAsync()
      }
    } catch {}
  }, [])

  return { playDrop, playWin }
}
