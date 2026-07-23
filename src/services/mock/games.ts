import { mockGames, type IMockGame } from '@/services/mock/data'
import { resolveGameStatus } from '@/utils/helpers/gameStatus'
import { GAME_STATUS } from '@/types/game'
import type { IGame, INewGame } from '@/types/game'

const gamesListeners: Array<(games: IGame[]) => void> = []

function toGame (raw: IMockGame): IGame {
  return {
    ...raw,
    status: resolveGameStatus(raw.status, raw.seatsTotal, raw.seatsTaken)
  }
}

function gamesSnapshot (): IGame[] {
  return mockGames.map(toGame)
}

async function fetchGames (): Promise<IGame[]> {
  return gamesSnapshot()
}

function subscribeToGames (callback: (games: IGame[]) => void) {
  gamesListeners.push(callback)
  callback(gamesSnapshot())
  return () => {
    const index = gamesListeners.indexOf(callback)
    if (index >= 0) gamesListeners.splice(index, 1)
  }
}

async function fetchGame (id: string): Promise<IGame | null> {
  const raw = mockGames.find((game) => game.id === id)
  return raw ? toGame(raw) : null
}

async function addGame (draft: INewGame): Promise<IGame> {
  const game: IMockGame = {
    ...draft,
    id: `game-${Date.now()}`,
    status: GAME_STATUS.OPEN,
    seatsTaken: 0
  }
  mockGames.push(game)
  notifyGamesChanged()
  return toGame(game)
}

async function fetchGamesByOrganizer (organizerId: string): Promise<IGame[]> {
  return mockGames.filter((game) => game.organizerId === organizerId).map(toGame)
}

function notifyGamesChanged () {
  gamesListeners.forEach((callback) => callback(gamesSnapshot()))
}

export { fetchGames, subscribeToGames, fetchGame, addGame, fetchGamesByOrganizer, notifyGamesChanged }
