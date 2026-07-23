import { getMarkerBadgeColors, getMarkerColor, getMarkerIcon } from '@/components/features/Map/helpers/markerStyle'
import { i18n } from '@/i18n'
import { GAME_STATUS, type IGameStatus } from '@/types/game'

interface IStatusUi {
  label: string
  color: string
  icon: string
  badgeBg: string
  badgeText: string
}

const STATUS_LABEL_KEYS: Record<IGameStatus, string> = {
  [GAME_STATUS.OPEN]: 'gameStatus.open',
  [GAME_STATUS.ALMOST_FULL]: 'gameStatus.almostFull',
  [GAME_STATUS.FULL]: 'gameStatus.full',
  [GAME_STATUS.IN_PROGRESS]: 'gameStatus.inProgress',
  [GAME_STATUS.FINISHED]: 'gameStatus.finished',
  [GAME_STATUS.CANCELLED]: 'gameStatus.cancelled'
}

function getStatusUi (status: IGameStatus): IStatusUi {
  const badge = getMarkerBadgeColors(status)
  return {
    label: i18n.global.t(STATUS_LABEL_KEYS[status]),
    color: getMarkerColor(status),
    icon: getMarkerIcon(status),
    badgeBg: badge.bg,
    badgeText: badge.text
  }
}

export { getStatusUi }
export type { IStatusUi }
