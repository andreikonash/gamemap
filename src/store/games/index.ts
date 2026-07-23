import { defineStore } from 'pinia'
import { fetchGame, subscribeToGames } from '@/services/games'
import type { IGame, ILatLng } from '@/types/game'

interface IBounds {
  north: number
  south: number
  east: number
  west: number
}

interface IGamesState {
  games: IGame[]
  mapBounds: IBounds | null
  stopGamesListener: (() => void) | null
  searchQuery: string
}

function createInitialState (): IGamesState {
  return {
    games: [],
    mapBounds: null,
    stopGamesListener: null,
    searchQuery: ''
  }
}

function isInsideBounds (location: ILatLng, bounds: IBounds): boolean {
  return (
    location.lat <= bounds.north &&
    location.lat >= bounds.south &&
    location.lng <= bounds.east &&
    location.lng >= bounds.west
  )
}

export const games = defineStore('games', {
  state: createInitialState,
  getters: {
    visibleGames: (state): IGame[] => {
      if (!state.mapBounds) return []
      const bounds = state.mapBounds
      return state.games.filter((game) => isInsideBounds(game.location, bounds))
    }
  },
  actions: {
    listenToGames () {
      if (this.stopGamesListener) return
      this.stopGamesListener = subscribeToGames((gamesList) => {
        this.games = gamesList
      })
    },
    setBounds (bounds: IBounds) {
      this.mapBounds = bounds
    },
    setSearchQuery (query: string) {
      this.searchQuery = query
    },
    async loadGame (id: string): Promise<IGame | null> {
      const known = this.games.find((game) => game.id === id)
      if (known) return known
      return fetchGame(id)
    }
  }
})

export type { IBounds }
