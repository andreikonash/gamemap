import { describe, it, expect } from 'vitest'
import { isRegistrationExpired, PAYMENT_WINDOW_HOURS } from '@/utils/helpers/bookingExpiry'
import { makeRegistration } from '@tests/fixtures/gameFixtures'
import { REGISTRATION_STATUS } from '@/types/booking'

describe('isRegistrationExpired', () => {
  it('is not expired when the payment window has not passed', () => {
    const registration = makeRegistration({ createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString() })
    expect(isRegistrationExpired(registration)).toBe(false)
  })

  it('is expired once the payment window has passed since creation', () => {
    const registration = makeRegistration({ createdAt: new Date(Date.now() - (PAYMENT_WINDOW_HOURS + 1) * 60 * 60 * 1000).toISOString() })
    expect(isRegistrationExpired(registration)).toBe(true)
  })

  it('is never expired once the registration is already paid', () => {
    const registration = makeRegistration({
      status: REGISTRATION_STATUS.PAID,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    })
    expect(isRegistrationExpired(registration)).toBe(false)
  })
})
