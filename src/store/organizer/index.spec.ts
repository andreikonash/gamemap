import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('@/services/games', () => ({
  fetchGamesByOrganizer: vi.fn()
}))
vi.mock('@/services/bookings', () => ({
  fetchGameRegistrations: vi.fn(),
  cancelRegistration: vi.fn()
}))

import { cancelRegistration, fetchGameRegistrations } from '@/services/bookings'
import { fetchGamesByOrganizer } from '@/services/games'
import { organizer } from '@/store/organizer'
import { REGISTRATION_STATUS } from '@/types/booking'
import { makeGame, makeRegistration } from '@tests/fixtures/gameFixtures'

describe('organizer store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('loads the games organized by the given user', async () => {
    vi.mocked(fetchGamesByOrganizer).mockResolvedValue([makeGame({ organizerId: 'u1' })])
    const store = organizer()

    await store.loadHostedGames('u1')

    expect(fetchGamesByOrganizer).toHaveBeenCalledWith('u1')
    expect(store.hostedGames).toHaveLength(1)
  })

  it('loads the roster for a specific game', async () => {
    const registration = makeRegistration()
    vi.mocked(fetchGameRegistrations).mockResolvedValue([registration])
    const store = organizer()

    await store.loadRoster('g1')

    expect(fetchGameRegistrations).toHaveBeenCalledWith('g1')
    expect(store.rosterByGameId.g1).toEqual([registration])
  })

  it('removes a pending participant and updates the cached roster', async () => {
    const registration = makeRegistration({ status: REGISTRATION_STATUS.PENDING_PAYMENT })
    vi.mocked(cancelRegistration).mockResolvedValue()
    const store = organizer()
    store.rosterByGameId.g1 = [registration]

    await store.removeParticipant(registration)

    expect(cancelRegistration).toHaveBeenCalledWith(registration)
    expect(store.rosterByGameId.g1).toEqual([])
  })

  it('refuses to remove an already-paid participant', async () => {
    const registration = makeRegistration({ status: REGISTRATION_STATUS.PAID })
    const store = organizer()
    store.rosterByGameId.g1 = [registration]

    await store.removeParticipant(registration)

    expect(cancelRegistration).not.toHaveBeenCalled()
    expect(store.rosterByGameId.g1).toEqual([registration])
  })
})
