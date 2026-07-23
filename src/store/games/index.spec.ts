import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('@/services/games', () => ({
  fetchGame: vi.fn(),
  subscribeToGames: vi.fn()
}))

import { games } from '@/store/games'
import { makeGame } from '@tests/fixtures/gameFixtures'

const BOUNDS = { north: 52, south: 51, east: 18, west: 17 }

describe('games store — visibleGames', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('returns no games before the map reports bounds', () => {
    const store = games()
    store.games = [makeGame()]
    expect(store.visibleGames).toEqual([])
  })

  it('returns only games inside the current bounds', () => {
    const store = games()
    const inside = makeGame({ id: 'in', location: { lat: 51.5, lng: 17.5 } })
    const outsideLat = makeGame({ id: 'out-lat', location: { lat: 53, lng: 17.5 } })
    const outsideLng = makeGame({ id: 'out-lng', location: { lat: 51.5, lng: 16 } })
    store.games = [inside, outsideLat, outsideLng]

    store.setBounds(BOUNDS)

    expect(store.visibleGames.map((game) => game.id)).toEqual(['in'])
  })

  it('includes a game sitting exactly on the bounds edge', () => {
    const store = games()
    store.games = [makeGame({ id: 'edge', location: { lat: BOUNDS.north, lng: BOUNDS.east } })]

    store.setBounds(BOUNDS)

    expect(store.visibleGames.map((game) => game.id)).toEqual(['edge'])
  })
})
