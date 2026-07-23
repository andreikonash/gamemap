const GAME_STATUS = {
  OPEN: 'open',
  ALMOST_FULL: 'almost_full',
  FULL: 'full',
  IN_PROGRESS: 'in_progress',
  FINISHED: 'finished',
  CANCELLED: 'cancelled'
} as const

type IGameStatus = typeof GAME_STATUS[keyof typeof GAME_STATUS]

interface ILatLng {
  lat: number
  lng: number
}

interface IGame {
  id: string
  title: string
  status: IGameStatus
  location: ILatLng
  address: string
  startsAt: string
  durationMinutes: number
  price: number
  seatsTotal: number
  seatsTaken: number
  organizerId?: string
}

type INewGame = Omit<IGame, 'id' | 'status' | 'seatsTaken'>

export { GAME_STATUS }
export type { IGame, IGameStatus, ILatLng, INewGame }
