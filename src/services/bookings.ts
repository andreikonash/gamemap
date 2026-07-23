import { IS_MOCK_BACKEND } from '@/utils/constants/env'

const impl = IS_MOCK_BACKEND
  ? await import('@/services/mock/bookings')
  : await import('@/services/firebase/bookings')

export const {
  createRegistration,
  fetchMyRegistrations,
  markRegistrationPaid,
  cancelRegistration,
  deleteMyRegistrations,
  fetchGameRegistrations
} = impl
