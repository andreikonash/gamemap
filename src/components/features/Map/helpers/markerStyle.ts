import { GAME_STATUS, type IGameStatus } from '@/types/game'

const MARKER_COLORS: Record<IGameStatus, string> = {
  [GAME_STATUS.OPEN]: '#16A34A',
  [GAME_STATUS.ALMOST_FULL]: '#F59E0B',
  [GAME_STATUS.FULL]: '#DC2626',
  [GAME_STATUS.IN_PROGRESS]: '#0891B2',
  [GAME_STATUS.FINISHED]: '#64748B',
  [GAME_STATUS.CANCELLED]: '#334155'
}

const MARKER_ICONS: Record<IGameStatus, string> = {
  [GAME_STATUS.OPEN]: 'check_circle',
  [GAME_STATUS.ALMOST_FULL]: 'warning',
  [GAME_STATUS.FULL]: 'lock',
  [GAME_STATUS.IN_PROGRESS]: 'play_circle',
  [GAME_STATUS.FINISHED]: 'flag',
  [GAME_STATUS.CANCELLED]: 'cancel'
}

interface IBadgeColors {
  bg: string
  text: string
}

const MARKER_BADGE_COLORS: Record<IGameStatus, IBadgeColors> = {
  [GAME_STATUS.OPEN]: { bg: '#6cf8bb', text: '#00714d' },
  [GAME_STATUS.ALMOST_FULL]: { bg: '#ffb95f', text: '#2a1700' },
  [GAME_STATUS.FULL]: { bg: '#dce2f3', text: '#424754' },
  [GAME_STATUS.IN_PROGRESS]: { bg: '#d8e2ff', text: '#001a42' },
  [GAME_STATUS.FINISHED]: { bg: '#e2e8f8', text: '#424754' },
  [GAME_STATUS.CANCELLED]: { bg: '#ffdad6', text: '#93000a' }
}

function getMarkerColor (status: IGameStatus): string {
  return MARKER_COLORS[status]
}

function getMarkerIcon (status: IGameStatus): string {
  return MARKER_ICONS[status]
}

function getMarkerBadgeColors (status: IGameStatus): IBadgeColors {
  return MARKER_BADGE_COLORS[status]
}

export { getMarkerColor, getMarkerIcon, getMarkerBadgeColors, MARKER_COLORS, MARKER_ICONS, MARKER_BADGE_COLORS }
