import { describe, it, expect, vi } from 'vitest'

vi.mock('@/plugins/firebase', () => ({
  firebaseAuth: {},
  firestore: {}
}))

import { mapGame } from '@/services/firebase/games'
import { GAME_STATUS } from '@/types/game'

const RAW_GAME = {
  title: 'Evening football',
  status: GAME_STATUS.OPEN,
  location: { lat: 51.11, lng: 17.03 },
  address: 'Legnicka 1, Wroclaw',
  startsAt: '2026-08-01T18:00:00.000Z',
  durationMinutes: 60,
  price: 25,
  seatsTotal: 10,
  seatsTaken: 3
}

describe('mapGame', () => {
  it('maps a Firestore document into an IGame with the doc id', () => {
    const game = mapGame('g1', RAW_GAME)

    expect(game).toEqual({ id: 'g1', ...RAW_GAME })
  })

  it('derives the status from seats when the stored status is stale', () => {
    const game = mapGame('g1', { ...RAW_GAME, seatsTaken: 10 })

    expect(game.status).toBe(GAME_STATUS.FULL)
  })
})
