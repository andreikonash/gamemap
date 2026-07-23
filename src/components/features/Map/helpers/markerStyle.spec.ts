import { describe, it, expect } from 'vitest'
import { getMarkerColor, getMarkerIcon, MARKER_COLORS, MARKER_ICONS } from '@/components/features/Map/helpers/markerStyle'
import { GAME_STATUS } from '@/types/game'

describe('getMarkerColor', () => {
  it('gives every status its own distinct color', () => {
    const statuses = Object.values(GAME_STATUS)
    const colors = statuses.map((status) => getMarkerColor(status))
    expect(new Set(colors).size).toBe(statuses.length)
  })

  it('covers every status in the color map', () => {
    expect(Object.keys(MARKER_COLORS).sort()).toEqual(Object.values(GAME_STATUS).sort())
  })
})

describe('getMarkerIcon', () => {
  it('gives every status its own distinct icon', () => {
    const statuses = Object.values(GAME_STATUS)
    const icons = statuses.map((status) => getMarkerIcon(status))
    expect(new Set(icons).size).toBe(statuses.length)
  })

  it('covers every status in the icon map', () => {
    expect(Object.keys(MARKER_ICONS).sort()).toEqual(Object.values(GAME_STATUS).sort())
  })
})
