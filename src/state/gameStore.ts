import { create } from 'zustand'

export type Phase = 'morning' | 'day' | 'evening' | 'night'
export type Speed = 1 | 2 | 4

const DAY_START_HOUR = 9
const MIN_PER_HOUR = 60
const FULL_DAY_LEN = 24 * MIN_PER_HOUR

const DAY_PHASE_LEN = 9 * MIN_PER_HOUR
const EVENING_PHASE_LEN = 4 * MIN_PER_HOUR
const NIGHT_PHASE_LEN = 8 * MIN_PER_HOUR

const DAY_END_AT = DAY_PHASE_LEN
const EVENING_END_AT = DAY_END_AT + EVENING_PHASE_LEN
const NIGHT_END_AT = EVENING_END_AT + NIGHT_PHASE_LEN

export type GameState = {
  elapsedMinutes: number
  isPaused: boolean
  speed: Speed
  advance: (minutes: number) => void
  togglePause: () => void
  setSpeed: (speed: Speed) => void
}

export const useGameStore = create<GameState>((set) => ({
  elapsedMinutes: 0,
  isPaused: false,
  speed: 1,
  advance: (minutes) => set((s) => ({ elapsedMinutes: s.elapsedMinutes + minutes })),
  togglePause: () => set((s) => ({ isPaused: !s.isPaused })),
  setSpeed: (speed) => set({ speed }),
}))

export type Clock = {
  day: number
  hour: number
  minute: number
  hourFloat: number
  phase: Phase
}

export function deriveClock(elapsedMinutes: number): Clock {
  const day = Math.floor(elapsedMinutes / FULL_DAY_LEN) + 1
  const within = elapsedMinutes - (day - 1) * FULL_DAY_LEN

  let phase: Phase
  if (within < DAY_END_AT) phase = 'day'
  else if (within < EVENING_END_AT) phase = 'evening'
  else if (within < NIGHT_END_AT) phase = 'night'
  else phase = 'morning'

  const hour = (DAY_START_HOUR + Math.floor(within / MIN_PER_HOUR)) % 24
  const minute = Math.floor(within % MIN_PER_HOUR)
  const hourFloat = (DAY_START_HOUR + within / MIN_PER_HOUR) % 24

  return { day, hour, minute, hourFloat, phase }
}
