// Retro arcade color palette — neon cyber meets 80s cabinet
export const COLORS = {
  // Backgrounds
  bg: '#0a0a0f',
  bgCard: '#12121a',
  boardBg: '#1a1a2e',
  boardFrame: '#252545',
  cellBg: '#0d0d1a',
  cellBorder: '#2a2a4a',

  // Player chips
  p1: '#ff2d55',        // Hot pink-red
  p1Glow: '#ff2d5566',
  p1Light: '#ff6b8a',
  p2: '#ffd60a',        // Electric yellow
  p2Glow: '#ffd60a66',
  p2Light: '#ffe566',

  // Accent
  accent: '#00f5d4',    // Cyan
  accentDim: '#00f5d440',
  accentBright: '#33ffdd',

  // Text
  text: '#e0e0e0',
  textDim: '#666680',
  textBright: '#ffffff',

  // States
  win: '#39ff14',       // Neon green
  winGlow: '#39ff1460',
  danger: '#ff3b30',
  warning: '#ff9500',

  // Scanline / CRT
  scanline: 'rgba(255,255,255,0.03)',
  vignette: 'rgba(0,0,0,0.6)',
} as const
