import { mockGames } from '@/services/mock/data'
import { notifyGamesChanged } from '@/services/mock/games'
import { REGISTRATION_STATUS, type IRegistration } from '@/types/booking'
import type { IGame } from '@/types/game'

const REGISTRATIONS_KEY = 'gamemap-mock-registrations'

function readRegistrations (): IRegistration[] {
  const raw = localStorage.getItem(REGISTRATIONS_KEY)
  return raw ? JSON.parse(raw) : []
}

function saveRegistrations (registrations: IRegistration[]) {
  localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(registrations))
}

// Re-apply persisted registrations to the in-memory seat counts after a page reload,
// so seat numbers and derived statuses stay consistent with the saved registrations.
readRegistrations().forEach((registration) => {
  const game = mockGames.find((mockGame) => mockGame.id === registration.gameId)
  if (game && game.seatsTaken < game.seatsTotal) game.seatsTaken += 1
})

async function createRegistration (game: IGame, userId: string): Promise<IRegistration> {
  const raw = mockGames.find((mockGame) => mockGame.id === game.id)
  if (!raw) throw new Error('game_not_found')
  if (raw.seatsTaken >= raw.seatsTotal) throw new Error('game_full')

  raw.seatsTaken += 1
  notifyGamesChanged()

  const registration: IRegistration = {
    id: `reg-${Date.now()}`,
    gameId: game.id,
    userId,
    status: REGISTRATION_STATUS.PENDING_PAYMENT,
    gameTitle: game.title,
    gameStartsAt: game.startsAt,
    price: game.price,
    createdAt: new Date().toISOString()
  }
  saveRegistrations([...readRegistrations(), registration])
  return registration
}

async function fetchMyRegistrations (userId: string): Promise<IRegistration[]> {
  return readRegistrations().filter((registration) => registration.userId === userId)
}

async function markRegistrationPaid (registrationId: string): Promise<void> {
  const registrations = readRegistrations().map((registration) =>
    registration.id === registrationId
      ? { ...registration, status: REGISTRATION_STATUS.PAID }
      : registration
  )
  saveRegistrations(registrations)
}

async function cancelRegistration (registration: IRegistration): Promise<void> {
  const raw = mockGames.find((mockGame) => mockGame.id === registration.gameId)
  if (raw) raw.seatsTaken = Math.max(raw.seatsTaken - 1, 0)
  notifyGamesChanged()
  saveRegistrations(readRegistrations().filter((existing) => existing.id !== registration.id))
}

async function deleteMyRegistrations (userId: string): Promise<void> {
  saveRegistrations(readRegistrations().filter((registration) => registration.userId !== userId))
}

async function fetchGameRegistrations (gameId: string): Promise<IRegistration[]> {
  return readRegistrations().filter((registration) => registration.gameId === gameId)
}

export {
  createRegistration,
  fetchMyRegistrations,
  markRegistrationPaid,
  cancelRegistration,
  deleteMyRegistrations,
  fetchGameRegistrations
}
