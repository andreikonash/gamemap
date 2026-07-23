import type { ITeam } from '@/types/team'

const mockTeams: ITeam[] = [
  {
    id: 'team-wroclaw-strikers',
    name: 'Wroclaw Strikers',
    sport: 'football',
    members: [
      { id: 'm-1', name: 'Alex Mercer' },
      { id: 'm-2', name: 'Jonas Kowalski' },
      { id: 'm-3', name: 'Marta Nowak' },
      { id: 'm-4', name: 'Piotr Zielinski' }
    ]
  },
  {
    id: 'team-nadodrze-ballers',
    name: 'Nadodrze Ballers',
    sport: 'basketball',
    members: [
      { id: 'm-5', name: 'Kasia Wisniewska' },
      { id: 'm-6', name: 'Tomasz Lis' },
      { id: 'm-7', name: 'Ewa Kaminska' }
    ]
  },
  {
    id: 'team-grabiszyn-spikers',
    name: 'Grabiszyn Spikers',
    sport: 'volleyball',
    members: [
      { id: 'm-8', name: 'Michal Wojcik' },
      { id: 'm-9', name: 'Ola Szymanska' },
      { id: 'm-10', name: 'Bartek Dudek' },
      { id: 'm-11', name: 'Zofia Kaczmarek' },
      { id: 'm-12', name: 'Adam Piotrowski' }
    ]
  },
  {
    id: 'team-krzyki-aces',
    name: 'Krzyki Aces',
    sport: 'tennis',
    members: [
      { id: 'm-13', name: 'Natalia Gorska' },
      { id: 'm-14', name: 'Rafal Krawczyk' }
    ]
  }
]

export { mockTeams }
