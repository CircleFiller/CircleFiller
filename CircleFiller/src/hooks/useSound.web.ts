// useSound.web.ts — web: use Web Audio API for sound synthesis
import { useRef, useCallback } from 'react'

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null)

  const getCtx = () => {
    if (!ctxRef.current) ctxRef.current = new AudioContext()
    return ctxRef.current
  }

  const playDrop = useCallback(() => {
    try {
      const ctx = getCtx()
      const sampleRate = ctx.sampleRate
      const duration = 0.35
      const bufferSize = Math.floor(sampleRate * duration)
      const buffer = ctx.createBuffer(1, bufferSize, sampleRate)
      const data = buffer.getChannelData(0)

      // Simulate chip falling through 5 row slots then landing
      // Each "tick" is the chip passing a row — gets faster (gravity)
      // Timing: accelerating intervals (gravity feel)
      const ticks = [0.0, 0.04, 0.075, 0.105, 0.13, 0.15]
      const landTime = 0.17

      for (let i = 0; i < bufferSize; i++) {
        const t = i / sampleRate
        let sample = 0

        // Row ticks — short plastic clicks, getting louder as chip accelerates
        for (let ti = 0; ti < ticks.length; ti++) {
          const dt = t - ticks[ti]
          if (dt > 0 && dt < 0.012) {
            const loudness = 0.08 + (ti / ticks.length) * 0.15
            const env = Math.exp(-dt * 400)
            // High-freq plastic click
            sample += Math.sin(2 * Math.PI * 2800 * dt) * env * loudness
            sample += (Math.random() * 2 - 1) * env * loudness * 0.4
          }
        }

        // Landing thunk — heavier, deeper, satisfying
        const lt = t - landTime
        if (lt > 0 && lt < 0.08) {
          const thunkEnv = Math.exp(-lt * 60)
          // Low body (plastic on plastic)
          sample += Math.sin(2 * Math.PI * 350 * lt) * thunkEnv * 0.4
          // Mid crack
          sample += Math.sin(2 * Math.PI * 900 * lt) * Math.exp(-lt * 120) * 0.25
          // Brief noise burst (impact)
          if (lt < 0.015) {
            sample += (Math.random() * 2 - 1) * Math.exp(-lt * 250) * 0.3
          }
        }

        // Subtle board rattle after landing
        const rt = t - landTime - 0.04
        if (rt > 0 && rt < 0.12) {
          const rattleEnv = Math.exp(-rt * 30)
          sample += Math.sin(2 * Math.PI * 180 * rt) * rattleEnv * 0.06
        }

        data[i] = Math.max(-1, Math.min(1, sample))
      }

      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.connect(ctx.destination)
      source.start()
    } catch {}
  }, [])

  const playWin = useCallback(() => {
    try {
      const ctx = getCtx()
      const duration = 0.6
      const bufferSize = Math.floor(ctx.sampleRate * duration)
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)

      const notes = [523.25, 659.25, 783.99, 1046.5]
      const noteLen = duration / notes.length

      for (let i = 0; i < bufferSize; i++) {
        const t = i / ctx.sampleRate
        const noteIdx = Math.min(Math.floor(t / noteLen), notes.length - 1)
        const noteT = t - noteIdx * noteLen
        const freq = notes[noteIdx]
        const env = Math.exp(-noteT * 4) * 0.6
        data[i] = Math.sin(2 * Math.PI * freq * t) * env
      }

      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.connect(ctx.destination)
      source.start()
    } catch {}
  }, [])

  return { playDrop, playWin }
}
