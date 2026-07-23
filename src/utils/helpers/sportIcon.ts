import { i18n } from '@/i18n'

const SPORT_KEYWORDS: Array<[string, string]> = [
  ['football', 'sports_soccer'],
  ['soccer', 'sports_soccer'],
  ['basketball', 'sports_basketball'],
  ['volleyball', 'sports_volleyball'],
  ['tennis', 'sports_tennis'],
  ['squash', 'sports_tennis'],
  ['badminton', 'sports_tennis'],
  ['run', 'directions_run'],
  ['table tennis', 'table_bar']
]

function getSportIcon (title: string): string {
  const normalized = title.toLowerCase()
  const match = SPORT_KEYWORDS.find(([keyword]) => normalized.includes(keyword))
  return match ? match[1] : 'sports'
}

function getSportLabel (title: string): string {
  const { t } = i18n.global
  const normalized = title.toLowerCase()
  if (normalized.includes('football')) return t('sport.football')
  if (normalized.includes('basketball')) return t('sport.basketball')
  if (normalized.includes('volleyball')) return t('sport.volleyball')
  if (normalized.includes('table tennis')) return t('sport.tableTennis')
  if (normalized.includes('tennis')) return t('sport.tennis')
  if (normalized.includes('squash')) return t('sport.squash')
  if (normalized.includes('badminton')) return t('sport.badminton')
  if (normalized.includes('run')) return t('sport.running')
  return t('sport.game')
}

const VOLLEYBALL_COURT_TYPE = {
  INDOOR: 'indoor',
  SAND: 'sand',
  OUTDOOR: 'outdoor'
} as const

type IVolleyballCourtType = typeof VOLLEYBALL_COURT_TYPE[keyof typeof VOLLEYBALL_COURT_TYPE]

const VOLLEYBALL_COURT_KEYWORDS: Array<[string, IVolleyballCourtType]> = [
  ['beach volleyball', VOLLEYBALL_COURT_TYPE.SAND],
  ['sand volleyball', VOLLEYBALL_COURT_TYPE.SAND],
  ['outdoor volleyball', VOLLEYBALL_COURT_TYPE.OUTDOOR],
  ['street volleyball', VOLLEYBALL_COURT_TYPE.OUTDOOR],
  ['indoor volleyball', VOLLEYBALL_COURT_TYPE.INDOOR]
]

function getVolleyballCourtType (title: string): IVolleyballCourtType | null {
  const normalized = title.toLowerCase()
  if (!normalized.includes('volleyball')) return null
  const match = VOLLEYBALL_COURT_KEYWORDS.find(([keyword]) => normalized.includes(keyword))
  return match ? match[1] : VOLLEYBALL_COURT_TYPE.INDOOR
}

type IGameCardArt = {
  icon: string
  gradientClass?: string
  iconColorClass?: string
}

const VOLLEYBALL_COURT_ART: Record<IVolleyballCourtType, IGameCardArt> = {
  indoor: {
    icon: 'stadium',
    gradientClass: 'bg-gradient-to-br from-indigo-500 to-blue-600',
    iconColorClass: 'text-white'
  },
  sand: {
    icon: 'beach_access',
    gradientClass: 'bg-gradient-to-br from-amber-400 to-orange-500',
    iconColorClass: 'text-white'
  },
  outdoor: {
    icon: 'sports_volleyball',
    gradientClass: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    iconColorClass: 'text-white'
  }
}

function getGameCardArt (title: string): IGameCardArt {
  const courtType = getVolleyballCourtType(title)
  if (courtType) return VOLLEYBALL_COURT_ART[courtType]
  return { icon: getSportIcon(title) }
}

export { getSportIcon, getSportLabel, getVolleyballCourtType, getGameCardArt, VOLLEYBALL_COURT_TYPE, VOLLEYBALL_COURT_ART }
export type { IVolleyballCourtType, IGameCardArt }
