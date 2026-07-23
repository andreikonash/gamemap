import { IS_MOCK_BACKEND } from '@/utils/constants/env'

const impl = IS_MOCK_BACKEND
  ? await import('@/services/mock/auth')
  : await import('@/services/firebase/auth')

export const {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  onSessionChange,
  resetPassword,
  deleteAccountUser,
  fetchIsSuperAdmin
} = impl
