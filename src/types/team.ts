interface ITeamMember {
  id: string
  name: string
}

interface ITeam {
  id: string
  name: string
  sport: string
  members: ITeamMember[]
}

export type { ITeam, ITeamMember }
