export type DistrictId =
  | 'cityhall'
  | 'hq'
  | 'port'
  | 'slum'
  | 'downtown'
  | 'commercial'
  | 'industrial'
  | 'residential'

export type District = {
  id: DistrictId
  name: string
  tileX: number
  tileY: number
  width: number
  depth: number
  baseColor: number
  buildings: Array<{ x: number; y: number; height: number; color: number }>
}

const COLOR = {
  cityhall: 0x4a4063,
  hq: 0x3b4a63,
  port: 0x2d3f4a,
  slum: 0x3a2f2a,
  downtown: 0x504a52,
  commercial: 0x5a4838,
  industrial: 0x2f3530,
  residential: 0x44424f,
} as const

function makeBuildings(
  width: number,
  depth: number,
  count: number,
  color: number,
  seed: number,
): District['buildings'] {
  const buildings: District['buildings'] = []
  let s = seed
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 0x100000000
    return s / 0x100000000
  }
  for (let i = 0; i < count; i++) {
    buildings.push({
      x: 0.5 + rand() * (width - 1),
      y: 0.5 + rand() * (depth - 1),
      height: 16 + Math.floor(rand() * 48),
      color,
    })
  }
  return buildings
}

export const DISTRICTS: District[] = [
  {
    id: 'cityhall',
    name: '시청구역',
    tileX: 0,
    tileY: 0,
    width: 4,
    depth: 3,
    baseColor: COLOR.cityhall,
    buildings: makeBuildings(4, 3, 4, 0x6b5e88, 11),
  },
  {
    id: 'hq',
    name: '협회본부',
    tileX: 5,
    tileY: 0,
    width: 4,
    depth: 3,
    baseColor: COLOR.hq,
    buildings: makeBuildings(4, 3, 3, 0x5670a0, 22),
  },
  {
    id: 'port',
    name: '항만',
    tileX: 10,
    tileY: 0,
    width: 5,
    depth: 3,
    baseColor: COLOR.port,
    buildings: makeBuildings(5, 3, 5, 0x4a6878, 33),
  },
  {
    id: 'slum',
    name: '슬럼',
    tileX: 0,
    tileY: 4,
    width: 4,
    depth: 3,
    baseColor: COLOR.slum,
    buildings: makeBuildings(4, 3, 7, 0x554238, 44),
  },
  {
    id: 'downtown',
    name: '도심',
    tileX: 5,
    tileY: 4,
    width: 4,
    depth: 3,
    baseColor: COLOR.downtown,
    buildings: makeBuildings(4, 3, 6, 0x7a7080, 55),
  },
  {
    id: 'commercial',
    name: '상업가',
    tileX: 10,
    tileY: 4,
    width: 5,
    depth: 3,
    baseColor: COLOR.commercial,
    buildings: makeBuildings(5, 3, 6, 0x8a6c4a, 66),
  },
  {
    id: 'industrial',
    name: '공업단지',
    tileX: 0,
    tileY: 8,
    width: 6,
    depth: 3,
    baseColor: COLOR.industrial,
    buildings: makeBuildings(6, 3, 5, 0x4a5346, 77),
  },
  {
    id: 'residential',
    name: '주택가',
    tileX: 7,
    tileY: 8,
    width: 8,
    depth: 3,
    baseColor: COLOR.residential,
    buildings: makeBuildings(8, 3, 8, 0x6a667c, 88),
  },
]
