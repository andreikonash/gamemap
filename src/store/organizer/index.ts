import { defineStore } from 'pinia'
import { cancelRegistration, fetchGameRegistrations } from '@/services/bookings'
import { fetchGamesByOrganizer } from '@/services/games'
import { REGISTRATION_STATUS, type IRegistration } from '@/types/booking'
import type { IGame } from '@/types/game'

interface IOrganizerState {
  hostedGames: IGame[]
  loadingHostedGames: boolean
  rosterByGameId: Record<string, IRegistration[]>
  loadingRosterGameId: string | null
}

function createInitialState (): IOrganizerState {
  return {
    hostedGames: [],
    loadingHostedGames: false,
    rosterByGameId: {},
    loadingRosterGameId: null
  }
}

export const organizer = defineStore('organizer', {
  state: createInitialState,
  actions: {
    async loadHostedGames (organizerId: string): Promise<void> {
      this.loadingHostedGames = true
      try {
        this.hostedGames = await fetchGamesByOrganizer(organizerId)
      } finally {
        this.loadingHostedGames = false
      }
    },
    async loadRoster (gameId: string): Promise<void> {
      this.loadingRosterGameId = gameId
      try {
        this.rosterByGameId[gameId] = await fetchGameRegistrations(gameId)
      } finally {
        this.loadingRosterGameId = null
      }
    },
    async removeParticipant (registration: IRegistration): Promise<void> {
      if (registration.status !== REGISTRATION_STATUS.PENDING_PAYMENT) return
      await cancelRegistration(registration)
      const roster = this.rosterByGameId[registration.gameId]
      if (roster) this.rosterByGameId[registration.gameId] = roster.filter((item) => item.id !== registration.id)
    }
  }
})
