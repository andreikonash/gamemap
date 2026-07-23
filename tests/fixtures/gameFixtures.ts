import { GAME_STATUS, type IGame } from '@/types/game'
import { REGISTRATION_STATUS, type IRegistration } from '@/types/booking'

function makeGame (overrides: Partial<IGame> = {}): IGame {
  return {
    id: 'g1',
    title: 'Evening football',
    status: GAME_STATUS.OPEN,
    location: { lat: 51.11, lng: 17.03 },
    address: 'Legnicka 1, Wroclaw',
    startsAt: '2026-08-01T18:00:00.000Z',
    durationMinutes: 60,
    price: 25,
    seatsTotal: 10,
    seatsTaken: 3,
    ...overrides
  }
}

function makeRegistration (overrides: Partial<IRegistration> = {}): IRegistration {
  return {
    id: 'r1',
    gameId: 'g1',
    userId: 'u1',
    status: REGISTRATION_STATUS.PENDING_PAYMENT,
    gameTitle: 'Evening football',
    gameStartsAt: '2026-08-01T18:00:00.000Z',
    price: 25,
    createdAt: '2026-07-13T10:00:00.000Z',
    ...overrides
  }
}

export { makeGame, makeRegistration }
