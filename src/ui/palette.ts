import type { Phase } from '../state/gameStore'

export type Palette = {
  sky: number
  tint: number
  tintAlpha: number
}

const PALETTES: Record<Phase, Palette> = {
  day: {
    sky: 0x1a1c24,
    tint: 0x7a8090,
    tintAlpha: 0.0,
  },
  evening: {
    sky: 0x231722,
    tint: 0xc06a3c,
    tintAlpha: 0.18,
  },
  night: {
    sky: 0x0a0b14,
    tint: 0x2a2050,
    tintAlpha: 0.32,
  },
}

export function paletteFor(phase: Phase): Palette {
  return PALETTES[phase]
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
