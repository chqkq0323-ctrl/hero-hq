export const TILE_WIDTH = 48
export const TILE_HEIGHT = 24

export type ScreenPoint = { sx: number; sy: number }

export function tileToScreen(tx: number, ty: number): ScreenPoint {
  return {
    sx: (tx - ty) * (TILE_WIDTH / 2),
    sy: (tx + ty) * (TILE_HEIGHT / 2),
  }
}

export function diamondPath(tx: number, ty: number): number[] {
  const top = tileToScreen(tx, ty)
  const right = tileToScreen(tx + 1, ty)
  const bottom = tileToScreen(tx + 1, ty + 1)
  const left = tileToScreen(tx, ty + 1)
  return [top.sx, top.sy, right.sx, right.sy, bottom.sx, bottom.sy, left.sx, left.sy]
}
