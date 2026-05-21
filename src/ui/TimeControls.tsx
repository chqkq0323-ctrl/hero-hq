import { useGameStore, type Speed } from '../state/gameStore'

const SPEEDS: Speed[] = [1, 2, 4]

export function TimeControls() {
  const isPaused = useGameStore((s) => s.isPaused)
  const speed = useGameStore((s) => s.speed)
  const togglePause = useGameStore((s) => s.togglePause)
  const setSpeed = useGameStore((s) => s.setSpeed)

  return (
    <div className="time-controls">
      <button
        type="button"
        className={`tc-btn ${isPaused ? 'active' : ''}`}
        onClick={togglePause}
        aria-label={isPaused ? '재개' : '일시정지'}
      >
        {isPaused ? '▶' : '❚❚'}
      </button>
      {SPEEDS.map((s) => (
        <button
          key={s}
          type="button"
          className={`tc-btn ${!isPaused && speed === s ? 'active' : ''}`}
          onClick={() => setSpeed(s)}
          aria-label={`${s}배속`}
        >
          {s}x
        </button>
      ))}
    </div>
  )
}
