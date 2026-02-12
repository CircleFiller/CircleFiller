// useSound.web.ts — web: use Web Audio API to play bundled sound files
import { useRef, useCallback } from 'react'

// Bundled audio files (Metro resolves require() at build time)
const DROP_SOUND = require('../../assets/sounds/chip_drop.wav')
const POP_SOUND = require('../../assets/sounds/chip_pop.wav')

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null)
  const dropBufferRef = useRef<AudioBuffer | null>(null)
  const popBufferRef = useRef<AudioBuffer | null>(null)

  const getCtx = () => {
    if (!ctxRef.current) ctxRef.current = new AudioContext()
    return ctxRef.current
  }

  const loadBuffer = async (src: any): Promise<AudioBuffer | null> => {
    try {
      const ctx = getCtx()
      // Metro bundles require() as a URI string on web
      const uri = typeof src === 'number' ? src : (src?.uri || src?.default || src)
      const response = await fetch(uri)
      const arrayBuffer = await response.arrayBuffer()
      return await ctx.decodeAudioData(arrayBuffer)
    } catch {
      return null
    }
  }

  const playDrop = useCallback(async () => {
    try {
      const ctx = getCtx()
      if (!dropBufferRef.current) {
        dropBufferRef.current = await loadBuffer(DROP_SOUND)
      }
      if (dropBufferRef.current) {
        const source = ctx.createBufferSource()
        source.buffer = dropBufferRef.current
        source.connect(ctx.destination)
        source.start()
      }
    } catch {}
  }, [])

  const playWin = useCallback(async () => {
    try {
      const ctx = getCtx()
      if (!popBufferRef.current) {
        popBufferRef.current = await loadBuffer(POP_SOUND)
      }
      if (popBufferRef.current) {
        const source = ctx.createBufferSource()
        source.buffer = popBufferRef.current
        source.connect(ctx.destination)
        source.start()
      }
    } catch {}
  }, [])

  return { playDrop, playWin }
}
