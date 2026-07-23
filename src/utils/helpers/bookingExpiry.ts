import { REGISTRATION_STATUS, type IRegistration } from '@/types/booking'

const PAYMENT_WINDOW_HOURS = 3

function isRegistrationExpired (registration: IRegistration): boolean {
  if (registration.status !== REGISTRATION_STATUS.PENDING_PAYMENT) return false
  const ageMs = Date.now() - new Date(registration.createdAt).getTime()
  return ageMs > PAYMENT_WINDOW_HOURS * 60 * 60 * 1000
}

export { isRegistrationExpired, PAYMENT_WINDOW_HOURS }
