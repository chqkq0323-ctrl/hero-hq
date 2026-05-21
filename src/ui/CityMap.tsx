import { useEffect, useRef } from 'react'
import { Application } from 'pixi.js'
import { buildScene, type Scene } from './scene'
import { useGameStore } from '../state/gameStore'
import { paletteAt } from './palette'

const GAME_MIN_PER_REAL_SEC = 6
const FULL_DAY = 21 * 60

export function CityMap() {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let app: Application | null = null
    let scene: Scene | null = null
    let cancelled = false

    const init = async () => {
      const a = new Application()
      await a.init({
        resizeTo: host,
        antialias: false,
        backgroundAlpha: 1,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      })
      if (cancelled) {
        a.destroy(true, { children: true })
        return
      }
      host.appendChild(a.canvas)
      const s = buildScene(a)
      s.applyPalette(paletteAt(useGameStore.getState().elapsedMinutes % FULL_DAY))
      app = a
      scene = s

      a.ticker.add((ticker) => {
        const state = useGameStore.getState()
        if (!state.isPaused) {
          const seconds = ticker.deltaMS / 1000
          if (seconds > 0) {
            const minutes = seconds * GAME_MIN_PER_REAL_SEC * state.speed
            state.advance(minutes)
          }
        }
        const minutesInDay = useGameStore.getState().elapsedMinutes % FULL_DAY
        s.applyPalette(paletteAt(minutesInDay))
      })
    }

    void init()

    return () => {
      cancelled = true
      if (app) {
        scene?.destroy()
        app.destroy(true, { children: true })
      }
    }
  }, [])

  return <div ref={hostRef} className="city-map" />
}
