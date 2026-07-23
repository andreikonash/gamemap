import { IS_MOCK_BACKEND } from '@/utils/constants/env'

const impl = IS_MOCK_BACKEND
  ? await import('@/services/mock/games')
  : await import('@/services/firebase/games')

export const { fetchGames, subscribeToGames, fetchGame, addGame, fetchGamesByOrganizer } = impl
