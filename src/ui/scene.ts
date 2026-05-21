import { Application, Container, Graphics } from 'pixi.js'
import { DISTRICTS, type District } from '../game/entities/district'
import { TILE_HEIGHT, TILE_WIDTH, diamondPath, tileToScreen } from './iso'
import { paletteFor } from './palette'
import type { Phase } from '../state/gameStore'

export type Scene = {
  setPhase: (phase: Phase) => void
  resize: (width: number, height: number) => void
  destroy: () => void
}

export function buildScene(app: Application): Scene {
  const world = new Container()
  const tintLayer = new Graphics()
  app.stage.addChild(world)
  app.stage.addChild(tintLayer)

  for (const district of DISTRICTS) {
    drawDistrict(world, district)
  }

  centerWorld(app, world)

  const setPhase = (phase: Phase) => {
    const p = paletteFor(phase)
    app.renderer.background.color = p.sky
    tintLayer.clear()
    if (p.tintAlpha > 0) {
      tintLayer
        .rect(0, 0, app.renderer.width, app.renderer.height)
        .fill({ color: p.tint, alpha: p.tintAlpha })
    }
  }

  const resize = (width: number, height: number) => {
    app.renderer.resize(width, height)
    centerWorld(app, world)
  }

  const destroy = () => {
    world.destroy({ children: true })
    tintLayer.destroy()
  }

  return { setPhase, resize, destroy }
}

function drawDistrict(parent: Container, d: District): void {
  const group = new Container()
  parent.addChild(group)

  const ground = new Graphics()
  for (let x = 0; x < d.width; x++) {
    for (let y = 0; y < d.depth; y++) {
      ground.poly(diamondPath(d.tileX + x, d.tileY + y))
      ground.fill({ color: d.baseColor })
      ground.stroke({ color: shade(d.baseColor, -0.2), width: 1, alpha: 0.5 })
    }
  }
  group.addChild(ground)

  const buildings = new Graphics()
  const sorted = [...d.buildings].sort((a, b) => a.x + a.y - (b.x + b.y))
  for (const b of sorted) {
    drawBuilding(buildings, d.tileX + b.x, d.tileY + b.y, b.height, b.color)
  }
  group.addChild(buildings)
}

function drawBuilding(g: Graphics, tx: number, ty: number, height: number, color: number): void {
  const halfW = TILE_WIDTH * 0.18
  const halfD = TILE_HEIGHT * 0.18
  const base = tileToScreen(tx, ty)

  const top = { sx: base.sx, sy: base.sy - height }
  const corners = {
    n: { sx: top.sx, sy: top.sy - halfD },
    e: { sx: top.sx + halfW, sy: top.sy },
    s: { sx: top.sx, sy: top.sy + halfD },
    w: { sx: top.sx - halfW, sy: top.sy },
  }
  const baseCorners = {
    e: { sx: base.sx + halfW, sy: base.sy },
    s: { sx: base.sx, sy: base.sy + halfD },
    w: { sx: base.sx - halfW, sy: base.sy },
  }

  g.poly([
    corners.s.sx, corners.s.sy,
    corners.e.sx, corners.e.sy,
    baseCorners.e.sx, baseCorners.e.sy,
    baseCorners.s.sx, baseCorners.s.sy,
  ]).fill({ color: shade(color, -0.18) })

  g.poly([
    corners.w.sx, corners.w.sy,
    corners.s.sx, corners.s.sy,
    baseCorners.s.sx, baseCorners.s.sy,
    baseCorners.w.sx, baseCorners.w.sy,
  ]).fill({ color: shade(color, -0.32) })

  g.poly([
    corners.n.sx, corners.n.sy,
    corners.e.sx, corners.e.sy,
    corners.s.sx, corners.s.sy,
    corners.w.sx, corners.w.sy,
  ]).fill({ color })
}

function centerWorld(app: Application, world: Container): void {
  const bounds = world.getLocalBounds()
  world.x = Math.round((app.renderer.width - bounds.width) / 2 - bounds.x)
  world.y = Math.round((app.renderer.height - bounds.height) / 2 - bounds.y)
}

function shade(color: number, factor: number): number {
  const r = (color >> 16) & 0xff
  const g = (color >> 8) & 0xff
  const b = color & 0xff
  const adjust = (c: number) => Math.max(0, Math.min(255, Math.round(c + (factor < 0 ? c * factor : (255 - c) * factor))))
  return (adjust(r) << 16) | (adjust(g) << 8) | adjust(b)
}
