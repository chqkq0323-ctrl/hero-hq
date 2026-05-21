import type { Phase } from '../state/gameStore'

export type PaletteSample = {
  sky: number
  tint: number
  tintAlpha: number
}

const NOON_SKY = 0x8a7e6a
const MIDNIGHT_SKY = 0x05060f
const DAY_TINT = 0xfce9b8
const DAY_TINT_ALPHA = 0.18
const NIGHT_TINT = 0x070824
const NIGHT_TINT_ALPHA = 0.45

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function lerpColor(a: number, b: number, t: number): number {
  const ar = (a >> 16) & 0xff
  const ag = (a >> 8) & 0xff
  const ab = a & 0xff
  const br = (b >> 16) & 0xff
  const bg = (b >> 8) & 0xff
  const bb = b & 0xff
  return (
    (Math.round(lerp(ar, br, t)) << 16) |
    (Math.round(lerp(ag, bg, t)) << 8) |
    Math.round(lerp(ab, bb, t))
  )
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

function darkness(hourFloat: number): number {
  const h = ((hourFloat % 24) + 24) % 24
  if (h >= 7 && h <= 17) return 0
  if (h > 17 && h < 22) return smoothstep(17, 22, h)
  if (h >= 22 || h < 5) return 1
  return 1 - smoothstep(5, 7, h)
}

export function paletteAtHour(hourFloat: number): PaletteSample {
  const d = darkness(hourFloat)
  return {
    sky: lerpColor(NOON_SKY, MIDNIGHT_SKY, d),
    tint: lerpColor(DAY_TINT, NIGHT_TINT, d),
    tintAlpha: lerp(DAY_TINT_ALPHA, NIGHT_TINT_ALPHA, d),
  }
}

export function phaseLabel(phase: Phase): string {
  switch (phase) {
    case 'morning':
      return '아침'
    case 'day':
      return '낮'
    case 'evening':
      return '저녁'
    case 'night':
      return '밤'
  }
}
