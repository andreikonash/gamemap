import { defineStore } from 'pinia'
import { addGame } from '@/services/games'
import { auth } from '@/store/auth'
import type { IVolleyballCourtType } from '@/utils/helpers/sportIcon'
import type { ILatLng, INewGame } from '@/types/game'

const SKILL_LEVEL = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
} as const

type ISkillLevel = typeof SKILL_LEVEL[keyof typeof SKILL_LEVEL]

type ISportOption = {
  value: string
  labelKey: string
  icon: string
}

const SPORT_OPTIONS: ISportOption[] = [
  { value: 'volleyball', labelKey: 'sport.volleyball', icon: 'sports_volleyball' },
  { value: 'football', labelKey: 'sport.football', icon: 'sports_soccer' },
  { value: 'basketball', labelKey: 'sport.basketball', icon: 'sports_basketball' },
  { value: 'tennis', labelKey: 'sport.tennis', icon: 'sports_tennis' },
  { value: 'running', labelKey: 'sport.running', icon: 'directions_run' },
  { value: 'table_tennis', labelKey: 'sport.tableTennis', icon: 'table_bar' }
]

type IVenue = {
  label: string
  address: string
  icon: string
  location: ILatLng
}

const RECENT_VENUES: IVenue[] = [
  { label: 'Rynek 14', address: 'Rynek 14, Wroclaw', icon: 'sports_soccer', location: { lat: 51.11, lng: 17.031 } },
  { label: 'Trzebnicka Courts', address: 'Trzebnicka 12, Wroclaw', icon: 'sports_basketball', location: { lat: 51.126, lng: 17.041 } },
  { label: 'Stadion Olimpijski', address: 'Al. Ignacego Paderewskiego 35, Wroclaw', icon: 'stadium', location: { lat: 51.126, lng: 17.086 } }
]

// No geocoding API is connected yet (backlog #11) — an address that doesn't match a
// known venue falls back to the city center rather than blocking publish entirely.
const WROCLAW_CENTER: ILatLng = { lat: 51.1079, lng: 17.0385 }

function resolveLocation (address: string): ILatLng {
  const venue = RECENT_VENUES.find((candidate) => candidate.address === address)
  return venue?.location ?? WROCLAW_CENTER
}

function minutesBetween (startTime: string, endTime: string): number {
  const [startHour, startMinute] = startTime.split(':').map(Number)
  const [endHour, endMinute] = endTime.split(':').map(Number)
  return (endHour * 60 + endMinute) - (startHour * 60 + startMinute)
}

const TOTAL_STEPS = 4

type ICreateGameState = {
  step: number
  sport: string
  courtType: IVolleyballCourtType | null
  title: string
  description: string
  address: string
  date: string
  startTime: string
  endTime: string
  maxPlayers: number
  price: number
  skillLevel: ISkillLevel
  isPublic: boolean
  published: boolean
}

function createInitialState (): ICreateGameState {
  return {
    step: 1,
    sport: 'basketball',
    courtType: null,
    title: '',
    description: '',
    address: '',
    date: '',
    startTime: '18:00',
    endTime: '20:00',
    maxPlayers: 10,
    price: 0,
    skillLevel: SKILL_LEVEL.INTERMEDIATE,
    isPublic: true,
    published: false
  }
}

export const createGame = defineStore('createGame', {
  state: createInitialState,
  getters: {
    sportOption: (state) => SPORT_OPTIONS.find((option) => option.value === state.sport) ?? SPORT_OPTIONS[0],
    canContinueFromDetails: (state) => state.title.trim().length > 0,
    canContinueFromLocation: (state) => state.address.trim().length > 0,
    canContinueFromLogistics: (state) => state.date.length > 0 && state.endTime > state.startTime,
    totalPoolEstimate: (state) => state.price * state.maxPlayers
  },
  actions: {
    goToStep (step: number) {
      this.step = Math.min(Math.max(step, 1), TOTAL_STEPS)
    },
    nextStep () {
      this.goToStep(this.step + 1)
    },
    previousStep () {
      this.goToStep(this.step - 1)
    },
    async publish () {
      const authStore = auth()
      if (!authStore.userId) throw new Error('not_authenticated')

      const draft: INewGame = {
        title: this.title.trim(),
        location: resolveLocation(this.address),
        address: this.address.trim(),
        startsAt: new Date(`${this.date}T${this.startTime}:00`).toISOString(),
        durationMinutes: minutesBetween(this.startTime, this.endTime),
        price: this.price,
        seatsTotal: this.maxPlayers,
        organizerId: authStore.userId
      }
      await addGame(draft)
      this.published = true
    }
  }
})

export { SKILL_LEVEL, SPORT_OPTIONS, RECENT_VENUES, TOTAL_STEPS, WROCLAW_CENTER }
export type { ISkillLevel, ISportOption, IVenue }
