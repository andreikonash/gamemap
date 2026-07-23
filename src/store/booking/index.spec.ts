import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('@/services/bookings', () => ({
  createRegistration: vi.fn(),
  fetchMyRegistrations: vi.fn(),
  markRegistrationPaid: vi.fn(),
  cancelRegistration: vi.fn()
}))

import { cancelRegistration, createRegistration, fetchMyRegistrations, markRegistrationPaid } from '@/services/bookings'
import { booking } from '@/store/booking'
import { PAYMENT_WINDOW_HOURS } from '@/utils/helpers/bookingExpiry'
import { GAME_STATUS } from '@/types/game'
import { REGISTRATION_STATUS } from '@/types/booking'
import { makeGame, makeRegistration } from '@tests/fixtures/gameFixtures'

describe('booking store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('joins a joinable game and stores the registration', async () => {
    const registration = makeRegistration()
    vi.mocked(createRegistration).mockResolvedValue(registration)
    const store = booking()
    const game = makeGame()

    const result = await store.joinGame(game, 'u1')

    expect(createRegistration).toHaveBeenCalledWith(game, 'u1')
    expect(result).toEqual(registration)
    expect(store.currentRegistration).toEqual(registration)
    expect(store.myRegistrations).toContainEqual(registration)
  })

  it('refuses to join a non-joinable game without calling the service', async () => {
    const store = booking()

    const result = await store.joinGame(makeGame({ status: GAME_STATUS.FULL }), 'u1')

    expect(result).toBeNull()
    expect(createRegistration).not.toHaveBeenCalled()
  })

  it('resets the joining flag when the service fails', async () => {
    vi.mocked(createRegistration).mockRejectedValue(new Error('game_full'))
    const store = booking()

    await expect(store.joinGame(makeGame(), 'u1')).rejects.toThrow('game_full')
    expect(store.joining).toBe(false)
  })

  it('payCurrent marks the current registration as paid', async () => {
    vi.mocked(markRegistrationPaid).mockResolvedValue()
    const store = booking()
    store.currentRegistration = makeRegistration()

    await store.payCurrent()

    expect(markRegistrationPaid).toHaveBeenCalledWith('r1')
    expect(store.currentRegistration?.status).toBe(REGISTRATION_STATUS.PAID)
  })

  it('cancels a pending registration and removes it from myRegistrations', async () => {
    vi.mocked(cancelRegistration).mockResolvedValue()
    const store = booking()
    const registration = makeRegistration({ status: REGISTRATION_STATUS.PENDING_PAYMENT })
    store.myRegistrations = [registration]
    store.currentRegistration = registration

    await store.cancelRegistration(registration.id)

    expect(cancelRegistration).toHaveBeenCalledWith(registration)
    expect(store.myRegistrations).toEqual([])
    expect(store.currentRegistration).toBeNull()
  })

  it('refuses to cancel an already-paid registration', async () => {
    const store = booking()
    const registration = makeRegistration({ status: REGISTRATION_STATUS.PAID })
    store.myRegistrations = [registration]

    await store.cancelRegistration(registration.id)

    expect(cancelRegistration).not.toHaveBeenCalled()
    expect(store.myRegistrations).toEqual([registration])
  })

  it('loadMyRegistrations sweeps and cancels registrations past the payment window', async () => {
    const fresh = makeRegistration({ id: 'r-fresh', status: REGISTRATION_STATUS.PENDING_PAYMENT, createdAt: new Date().toISOString() })
    const expired = makeRegistration({ id: 'r-expired', status: REGISTRATION_STATUS.PENDING_PAYMENT, createdAt: new Date(Date.now() - (PAYMENT_WINDOW_HOURS + 1) * 60 * 60 * 1000).toISOString() })
    vi.mocked(fetchMyRegistrations).mockResolvedValue([fresh, expired])
    vi.mocked(cancelRegistration).mockResolvedValue()
    const store = booking()

    await store.loadMyRegistrations('u1')

    expect(cancelRegistration).toHaveBeenCalledWith(expired)
    expect(store.myRegistrations).toEqual([fresh])
  })
})
