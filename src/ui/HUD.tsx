import { deriveClock, useGameStore } from '../state/gameStore'
import { phaseLabel } from './palette'

export function HUD() {
  const elapsed = useGameStore((s) => s.elapsedMinutes)
  const { day, hour, minute, phase } = deriveClock(elapsed)
  const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`

  return (
    <header className="hud">
      <div className="hud-left">
        <span className="hud-title">HERO HQ</span>
      </div>
      <div className="hud-center">
        <span className="hud-day">Day {day}</span>
        <span className="hud-sep">·</span>
        <span className="hud-time">{time}</span>
        <span className="hud-sep">·</span>
        <span className={`hud-phase phase-${phase}`}>{phaseLabel(phase)}</span>
      </div>
      <div className="hud-right" />
    </header>
  )
}
