import type { Phase } from '../state/gameStore'

export type PaletteSample = {
  sky: number
  tint: number
  tintAlpha: number
}

type Stop = PaletteSample & { t: number }

const FULL_DAY = 21 * 60

const STOPS: Stop[] = [
  { t: 0,    sky: 0x1d2128, tint: 0x6090b8, tintAlpha: 0.04 },
  { t: 180,  sky: 0x232830, tint: 0xa8a8b0, tintAlpha: 0.0  },
  { t: 420,  sky: 0x2c2724, tint: 0xb07848, tintAlpha: 0.04 },
  { t: 540,  sky: 0x221c20, tint: 0x8a4828, tintAlpha: 0.07 },
  { t: 720,  sky: 0x12121f, tint: 0x3a2c5a, tintAlpha: 0.15 },
  { t: 900,  sky: 0x070815, tint: 0x000510, tintAlpha: 0.36 },
  { t: 1080, sky: 0x070815, tint: 0x000510, tintAlpha: 0.40 },
  { t: 1260, sky: 0x1d2128, tint: 0x6090b8, tintAlpha: 0.04 },
]

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

export function paletteAt(minutesInDay: number): PaletteSample {
  const t = ((minutesInDay % FULL_DAY) + FULL_DAY) % FULL_DAY
  for (let i = 0; i < STOPS.length - 1; i++) {
    const a = STOPS[i]
    const b = STOPS[i + 1]
    if (t >= a.t && t <= b.t) {
      const local = b.t === a.t ? 0 : (t - a.t) / (b.t - a.t)
      return {
        sky: lerpColor(a.sky, b.sky, local),
        tint: lerpColor(a.tint, b.tint, local),
        tintAlpha: lerp(a.tintAlpha, b.tintAlpha, local),
      }
    }
  }
  const last = STOPS[STOPS.length - 1]
  return { sky: last.sky, tint: last.tint, tintAlpha: last.tintAlpha }
}

export function phaseLabel(phase: Phase): string {
  switch (phase) {
    case 'day':
      return '낮'
    case 'evening':
      return '저녁'
    case 'night':
      return '밤'
  }
}
