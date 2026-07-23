import { mockTeams } from '@/services/mock/teamsData'
import type { ITeam } from '@/types/team'

const MEMBERSHIPS_KEY = 'gamemap-mock-team-memberships'

type ITeamMembership = {
  userId: string
  teamId: string
}

function readMemberships (): ITeamMembership[] {
  const raw = localStorage.getItem(MEMBERSHIPS_KEY)
  return raw ? JSON.parse(raw) : []
}

function saveMemberships (memberships: ITeamMembership[]) {
  localStorage.setItem(MEMBERSHIPS_KEY, JSON.stringify(memberships))
}

async function fetchAllTeams (): Promise<ITeam[]> {
  return mockTeams
}

async function fetchMyTeamIds (userId: string): Promise<string[]> {
  return readMemberships()
    .filter((membership) => membership.userId === userId)
    .map((membership) => membership.teamId)
}

async function joinTeam (teamId: string, userId: string): Promise<void> {
  const memberships = readMemberships()
  if (memberships.some((membership) => membership.teamId === teamId && membership.userId === userId)) return
  saveMemberships([...memberships, { userId, teamId }])
}

async function leaveTeam (teamId: string, userId: string): Promise<void> {
  const memberships = readMemberships().filter(
    (membership) => !(membership.teamId === teamId && membership.userId === userId)
  )
  saveMemberships(memberships)
}

async function leaveAllTeams (userId: string): Promise<void> {
  saveMemberships(readMemberships().filter((membership) => membership.userId !== userId))
}

export { fetchAllTeams, fetchMyTeamIds, joinTeam, leaveTeam, leaveAllTeams }
