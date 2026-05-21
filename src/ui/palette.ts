import type { Phase } from '../state/gameStore'

export type PaletteSample = {
  sky: number
  tint: number
  tintAlpha: number
}

const NOON_SKY = 0x2c3038
const MIDNIGHT_SKY = 0x05060f
const OVERLAY_TINT = 0x070824
const PEAK_OVERLAY_ALPHA = 0.45

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

function darkness(hourFloat: number): number {
  const angle = ((hourFloat - 12) / 24) * Math.PI * 2
  return 0.5 - 0.5 * Math.cos(angle)
}

export function paletteAtHour(hourFloat: number): PaletteSample {
  const d = darkness(hourFloat)
  return {
    sky: lerpColor(NOON_SKY, MIDNIGHT_SKY, d),
    tint: OVERLAY_TINT,
    tintAlpha: d * PEAK_OVERLAY_ALPHA,
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
