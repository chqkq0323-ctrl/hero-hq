import { CityMap } from './ui/CityMap'
import { HUD } from './ui/HUD'
import { TimeControls } from './ui/TimeControls'

export default function App() {
  return (
    <div className="app">
      <HUD />
      <main className="stage">
        <CityMap />
        <TimeControls />
      </main>
    </div>
  )
}
