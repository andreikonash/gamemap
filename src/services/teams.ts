import { IS_MOCK_BACKEND } from '@/utils/constants/env'

const impl = IS_MOCK_BACKEND
  ? await import('@/services/mock/teams')
  : await import('@/services/firebase/teams')

export const { fetchAllTeams, fetchMyTeamIds, joinTeam, leaveTeam, leaveAllTeams } = impl
