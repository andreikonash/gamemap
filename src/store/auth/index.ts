import { defineStore } from 'pinia'
import type { ISessionUser } from '@/types/auth'
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  onSessionChange,
  resetPassword,
  deleteAccountUser,
  fetchIsSuperAdmin
} from '@/services/auth'

interface IAuthState {
  user: ISessionUser | null
  sessionReady: boolean
  redirectPath: string | null
  isSuperAdmin: boolean
}

function createInitialState (): IAuthState {
  return {
    user: null,
    sessionReady: false,
    redirectPath: null,
    isSuperAdmin: false
  }
}

export const auth = defineStore('auth', {
  state: createInitialState,
  getters: {
    isLoggedIn: (state) => state.user !== null,
    userId: (state) => state.user?.uid ?? null
  },
  actions: {
    listenToSession () {
      onSessionChange((user) => {
        this.user = user
        this.sessionReady = true
        this.isSuperAdmin = false
        if (user) fetchIsSuperAdmin().then((isSuperAdmin) => { this.isSuperAdmin = isSuperAdmin })
      })
    },
    setRedirect (path: string) {
      this.redirectPath = path
    },
    takeRedirect (): string {
      const path = this.redirectPath ?? '/discover'
      this.redirectPath = null
      return path
    },
    async signInWithGoogle () {
      await signInWithGoogle()
    },
    async signInWithEmail (email: string, password: string) {
      await signInWithEmail(email, password)
    },
    async signUpWithEmail (email: string, password: string) {
      await signUpWithEmail(email, password)
    },
    async signOut () {
      await signOutUser()
    },
    async resetPassword (email: string) {
      await resetPassword(email)
    },
    async deleteAccount () {
      await deleteAccountUser()
    }
  }
})
