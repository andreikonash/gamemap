import { GAME_STATUS, type IGame, type IGameStatus } from '@/types/game'

const ALMOST_FULL_SEATS_LEFT = 2

const JOINABLE_STATUSES: IGameStatus[] = [GAME_STATUS.OPEN, GAME_STATUS.ALMOST_FULL]

function resolveGameStatus (raw: IGameStatus, seatsTotal: number, seatsTaken: number): IGameStatus {
  if (raw !== GAME_STATUS.OPEN) return raw
  const seatsLeft = seatsTotal - seatsTaken
  if (seatsLeft <= 0) return GAME_STATUS.FULL
  if (seatsLeft <= ALMOST_FULL_SEATS_LEFT) return GAME_STATUS.ALMOST_FULL
  return GAME_STATUS.OPEN
}

function isGameJoinable (game: IGame): boolean {
  return JOINABLE_STATUSES.includes(game.status)
}

export { resolveGameStatus, isGameJoinable, ALMOST_FULL_SEATS_LEFT }
