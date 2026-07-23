import { defineStore } from 'pinia'
import {
  cancelRegistration,
  createRegistration,
  deleteMyRegistrations,
  fetchMyRegistrations,
  markRegistrationPaid
} from '@/services/bookings'
import { isRegistrationExpired } from '@/utils/helpers/bookingExpiry'
import { isGameJoinable } from '@/utils/helpers/gameStatus'
import { REGISTRATION_STATUS, type IRegistration } from '@/types/booking'
import type { IGame } from '@/types/game'

interface IBookingState {
  myRegistrations: IRegistration[]
  currentRegistration: IRegistration | null
  joining: boolean
  loadingRegistrations: boolean
}

function createInitialState (): IBookingState {
  return {
    myRegistrations: [],
    currentRegistration: null,
    joining: false,
    loadingRegistrations: true
  }
}

export const booking = defineStore('booking', {
  state: createInitialState,
  actions: {
    async joinGame (game: IGame, userId: string): Promise<IRegistration | null> {
      if (!isGameJoinable(game)) return null
      this.joining = true
      try {
        const registration = await createRegistration(game, userId)
        this.currentRegistration = registration
        this.myRegistrations.push(registration)
        return registration
      } finally {
        this.joining = false
      }
    },
    async payCurrent (): Promise<void> {
      if (!this.currentRegistration) return
      await markRegistrationPaid(this.currentRegistration.id)
      this.currentRegistration.status = REGISTRATION_STATUS.PAID
    },
    async loadMyRegistrations (userId: string): Promise<void> {
      this.loadingRegistrations = true
      try {
        const registrations = await fetchMyRegistrations(userId)
        const expired = registrations.filter(isRegistrationExpired)
        await Promise.all(expired.map((registration) => cancelRegistration(registration)))
        this.myRegistrations = registrations.filter((registration) => !isRegistrationExpired(registration))
      } finally {
        this.loadingRegistrations = false
      }
    },
    async cancelRegistration (registrationId: string): Promise<void> {
      const registration = this.myRegistrations.find((item) => item.id === registrationId)
      if (!registration || registration.status !== REGISTRATION_STATUS.PENDING_PAYMENT) return
      await cancelRegistration(registration)
      this.myRegistrations = this.myRegistrations.filter((item) => item.id !== registrationId)
      if (this.currentRegistration?.id === registrationId) this.currentRegistration = null
    },
    async deleteMyRegistrations (userId: string): Promise<void> {
      await deleteMyRegistrations(userId)
      this.myRegistrations = []
    }
  }
})
