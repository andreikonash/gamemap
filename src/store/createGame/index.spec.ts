import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('@/services/games', () => ({
  addGame: vi.fn()
}))

import { addGame } from '@/services/games'
import { auth } from '@/store/auth'
import { createGame, WROCLAW_CENTER } from '@/store/createGame'
import { makeGame } from '@tests/fixtures/gameFixtures'

function fillPublishableState (store: ReturnType<typeof createGame>, overrides: Partial<{ title: string, address: string }> = {}) {
  store.$patch({
    title: overrides.title ?? 'Sunday 5-a-side',
    address: overrides.address ?? 'Rynek 14, Wroclaw',
    date: '2026-08-01',
    startTime: '18:00',
    endTime: '20:00',
    price: 25,
    maxPlayers: 10
  })
}

describe('createGame store — publish', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.mocked(addGame).mockReset()
    vi.mocked(addGame).mockResolvedValue(makeGame())
    auth().user = { uid: 'organizer-1', email: null, displayName: null }
  })

  it('sends the resolved venue location, computed schedule fields and organizerId for a known address', async () => {
    const store = createGame()
    fillPublishableState(store)

    await store.publish()

    expect(addGame).toHaveBeenCalledWith({
      title: 'Sunday 5-a-side',
      location: { lat: 51.11, lng: 17.031 },
      address: 'Rynek 14, Wroclaw',
      startsAt: new Date('2026-08-01T18:00:00').toISOString(),
      durationMinutes: 120,
      price: 25,
      seatsTotal: 10,
      organizerId: 'organizer-1'
    })
    expect(store.published).toBe(true)
  })

  it('refuses to publish without a signed-in organizer', async () => {
    auth().user = null
    const store = createGame()
    fillPublishableState(store)

    await expect(store.publish()).rejects.toThrow('not_authenticated')
    expect(addGame).not.toHaveBeenCalled()
  })

  it('falls back to the city center location for an address with no matching venue', async () => {
    const store = createGame()
    fillPublishableState(store, { address: 'Some random street 5, Wroclaw' })

    await store.publish()

    expect(vi.mocked(addGame).mock.calls[0][0].location).toEqual(WROCLAW_CENTER)
  })

  it('leaves published false and rethrows when the game fails to persist', async () => {
    const store = createGame()
    fillPublishableState(store)
    vi.mocked(addGame).mockRejectedValue(new Error('offline'))

    await expect(store.publish()).rejects.toThrow('offline')
    expect(store.published).toBe(false)
  })
})
