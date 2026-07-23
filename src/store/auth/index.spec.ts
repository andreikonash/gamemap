import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { ISessionUser } from '@/types/auth'

const sessionCallbacks: Array<(user: ISessionUser | null) => void> = []

vi.mock('@/services/auth', () => ({
  signInWithGoogle: vi.fn(),
  signInWithEmail: vi.fn(),
  signUpWithEmail: vi.fn(),
  signOutUser: vi.fn(),
  fetchIsSuperAdmin: vi.fn().mockResolvedValue(false),
  onSessionChange: vi.fn((callback: (user: ISessionUser | null) => void) => {
    sessionCallbacks.push(callback)
  })
}))

import { auth } from '@/store/auth'

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    sessionCallbacks.length = 0
    vi.clearAllMocks()
  })

  it('sets the user and marks the session ready when the session listener fires', () => {
    const store = auth()
    store.listenToSession()

    sessionCallbacks[0]({ uid: 'u1', email: null, displayName: null })

    expect(store.isLoggedIn).toBe(true)
    expect(store.userId).toBe('u1')
    expect(store.sessionReady).toBe(true)
  })

  it('clears the user when the session listener reports sign-out', () => {
    const store = auth()
    store.listenToSession()
    sessionCallbacks[0]({ uid: 'u1', email: null, displayName: null })

    sessionCallbacks[0](null)

    expect(store.isLoggedIn).toBe(false)
    expect(store.userId).toBeNull()
  })

  it('takeRedirect returns the saved path once and then falls back to the app', () => {
    const store = auth()
    store.setRedirect('/cabinet')

    expect(store.takeRedirect()).toBe('/cabinet')
    expect(store.takeRedirect()).toBe('/discover')
  })
})
