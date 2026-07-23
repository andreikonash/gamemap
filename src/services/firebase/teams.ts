import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where
} from 'firebase/firestore'
import { firestore } from '@/plugins/firebase'
import type { ITeam } from '@/types/team'

const TEAMS_COLLECTION = 'teams'
const TEAM_MEMBERSHIPS_COLLECTION = 'teamMemberships'

function membershipId (teamId: string, userId: string): string {
  return `${userId}_${teamId}`
}

async function fetchAllTeams (): Promise<ITeam[]> {
  const snapshot = await getDocs(collection(firestore, TEAMS_COLLECTION))
  return snapshot.docs.map((docItem) => docItem.data() as ITeam)
}

async function fetchMyTeamIds (userId: string): Promise<string[]> {
  const membershipsQuery = query(
    collection(firestore, TEAM_MEMBERSHIPS_COLLECTION),
    where('userId', '==', userId)
  )
  const snapshot = await getDocs(membershipsQuery)
  return snapshot.docs.map((docItem) => docItem.data().teamId as string)
}

async function joinTeam (teamId: string, userId: string): Promise<void> {
  await setDoc(doc(firestore, TEAM_MEMBERSHIPS_COLLECTION, membershipId(teamId, userId)), {
    userId,
    teamId
  })
}

async function leaveTeam (teamId: string, userId: string): Promise<void> {
  await deleteDoc(doc(firestore, TEAM_MEMBERSHIPS_COLLECTION, membershipId(teamId, userId)))
}

async function leaveAllTeams (userId: string): Promise<void> {
  const teamIds = await fetchMyTeamIds(userId)
  await Promise.all(teamIds.map((teamId) => leaveTeam(teamId, userId)))
}

export { fetchAllTeams, fetchMyTeamIds, joinTeam, leaveTeam, leaveAllTeams }
