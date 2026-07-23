import { defineStore } from 'pinia'
import { fetchAllTeams, fetchMyTeamIds, joinTeam, leaveAllTeams, leaveTeam } from '@/services/teams'
import type { ITeam } from '@/types/team'

interface ITeamsState {
  allTeams: ITeam[]
  myTeamIds: string[]
  loading: boolean
}

function createInitialState (): ITeamsState {
  return {
    allTeams: [],
    myTeamIds: [],
    loading: true
  }
}

export const teams = defineStore('teams', {
  state: createInitialState,
  getters: {
    myTeams: (state): ITeam[] => state.allTeams.filter((team) => state.myTeamIds.includes(team.id)),
    discoverableTeams: (state): ITeam[] => state.allTeams.filter((team) => !state.myTeamIds.includes(team.id))
  },
  actions: {
    async loadTeams (userId: string): Promise<void> {
      this.loading = true
      try {
        const [allTeams, myTeamIds] = await Promise.all([fetchAllTeams(), fetchMyTeamIds(userId)])
        this.allTeams = allTeams
        this.myTeamIds = myTeamIds
      } finally {
        this.loading = false
      }
    },
    async join (teamId: string, userId: string): Promise<void> {
      await joinTeam(teamId, userId)
      this.myTeamIds = [...this.myTeamIds, teamId]
    },
    async leave (teamId: string, userId: string): Promise<void> {
      await leaveTeam(teamId, userId)
      this.myTeamIds = this.myTeamIds.filter((id) => id !== teamId)
    },
    async leaveAllTeams (userId: string): Promise<void> {
      await leaveAllTeams(userId)
      this.myTeamIds = []
    }
  }
})
