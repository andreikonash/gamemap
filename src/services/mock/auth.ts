import type { ISessionUser } from '@/types/auth'

const SESSION_KEY = 'gamemap-mock-session'

const sessionCallbacks: Array<(user: ISessionUser | null) => void> = []

function readStoredUser (): ISessionUser | null {
  const raw = localStorage.getItem(SESSION_KEY)
  return raw ? JSON.parse(raw) : null
}

function setUser (user: ISessionUser | null) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(SESSION_KEY)
  }
  sessionCallbacks.forEach((callback) => callback(user))
}

async function signInWithGoogle () {
  setUser({ uid: 'mock-google-user', email: 'demo@gamemap.dev', displayName: 'Demo User' })
}

async function signInWithEmail (email: string, _password: string) {
  setUser({ uid: `mock-${email}`, email, displayName: email.split('@')[0] })
}

async function signUpWithEmail (email: string, password: string) {
  await signInWithEmail(email, password)
}

async function signOutUser () {
  setUser(null)
}

async function resetPassword (_email: string) {
  // no-op in mock mode — there is no real inbox to send to
}

async function deleteAccountUser () {
  setUser(null)
}

async function fetchIsSuperAdmin (): Promise<boolean> {
  return false
}

function onSessionChange (callback: (user: ISessionUser | null) => void) {
  sessionCallbacks.push(callback)
  callback(readStoredUser())
  return () => {
    const index = sessionCallbacks.indexOf(callback)
    if (index >= 0) sessionCallbacks.splice(index, 1)
  }
}

export {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  onSessionChange,
  resetPassword,
  deleteAccountUser,
  fetchIsSuperAdmin
}
