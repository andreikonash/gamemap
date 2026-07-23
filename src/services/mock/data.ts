import { GAME_STATUS, type IGameStatus, type ILatLng } from '@/types/game'

interface IMockGame {
  id: string
  title: string
  status: IGameStatus
  location: ILatLng
  address: string
  startsAt: string
  durationMinutes: number
  price: number
  seatsTotal: number
  seatsTaken: number
  organizerId?: string
}

const DURATION_OPTIONS_MINUTES = [120, 150]

function randomDuration (): number {
  return DURATION_OPTIONS_MINUTES[Math.floor(Math.random() * DURATION_OPTIONS_MINUTES.length)]
}

const mockGames: IMockGame[] = [
  {
    id: 'g-football-old-town',
    title: 'Football 5v5 — Old Town',
    status: GAME_STATUS.OPEN,
    location: { lat: 51.11, lng: 17.031 },
    address: 'Rynek 14, Wroclaw',
    startsAt: '2026-07-18T18:00:00.000Z',
    durationMinutes: randomDuration(),
    price: 25,
    seatsTotal: 10,
    seatsTaken: 3
  },
  {
    id: 'g-basket-nadodrze',
    title: 'Basketball 3x3 — Nadodrze',
    status: GAME_STATUS.OPEN,
    location: { lat: 51.126, lng: 17.041 },
    address: 'Trzebnicka 12, Wroclaw',
    startsAt: '2026-07-17T17:30:00.000Z',
    durationMinutes: randomDuration(),
    price: 15,
    seatsTotal: 6,
    seatsTaken: 5
  },
  {
    id: 'g-volley-grabiszyn',
    title: 'Indoor Volleyball — Grabiszyn Sports Hall',
    status: GAME_STATUS.OPEN,
    location: { lat: 51.093, lng: 16.985 },
    address: 'Grabiszynska 200, Wroclaw',
    startsAt: '2026-07-19T11:00:00.000Z',
    durationMinutes: randomDuration(),
    price: 20,
    seatsTotal: 12,
    seatsTaken: 12
  },
  {
    id: 'g-volley-beach-odra',
    title: 'Beach Volleyball — Odra Riverside',
    status: GAME_STATUS.OPEN,
    location: { lat: 51.117, lng: 17.043 },
    address: 'Wybrzeze Slowackiego, Wroclaw',
    startsAt: '2026-07-18T15:00:00.000Z',
    durationMinutes: randomDuration(),
    price: 10,
    seatsTotal: 8,
    seatsTaken: 4
  },
  {
    id: 'g-volley-outdoor-parkPoludniowy',
    title: 'Outdoor Volleyball — Park Poludniowy',
    status: GAME_STATUS.OPEN,
    location: { lat: 51.087, lng: 17.03 },
    address: 'Park Poludniowy, Wroclaw',
    startsAt: '2026-07-20T17:00:00.000Z',
    durationMinutes: randomDuration(),
    price: 12,
    seatsTotal: 10,
    seatsTaken: 3
  },
  {
    id: 'g-tennis-krzyki',
    title: 'Tennis doubles — Krzyki',
    status: GAME_STATUS.IN_PROGRESS,
    location: { lat: 51.075, lng: 17.02 },
    address: 'Powstancow Slaskich 95, Wroclaw',
    startsAt: '2026-07-14T09:00:00.000Z',
    durationMinutes: randomDuration(),
    price: 40,
    seatsTotal: 4,
    seatsTaken: 4
  },
  {
    id: 'g-run-odra',
    title: 'Evening run — Odra riverside',
    status: GAME_STATUS.OPEN,
    location: { lat: 51.115, lng: 17.055 },
    address: 'Wybrzeze Wyspianskiego, Wroclaw',
    startsAt: '2026-07-16T19:00:00.000Z',
    durationMinutes: randomDuration(),
    price: 0,
    seatsTotal: 20,
    seatsTaken: 4
  },
  {
    id: 'g-badminton-fabryczna',
    title: 'Badminton — Fabryczna',
    status: GAME_STATUS.CANCELLED,
    location: { lat: 51.105, lng: 16.96 },
    address: 'Legnicka 58, Wroclaw',
    startsAt: '2026-07-20T16:00:00.000Z',
    durationMinutes: randomDuration(),
    price: 18,
    seatsTotal: 8,
    seatsTaken: 2
  },
  {
    id: 'g-football-stadium',
    title: 'Football 11v11 — Stadium pitch',
    status: GAME_STATUS.FINISHED,
    location: { lat: 51.141, lng: 16.943 },
    address: 'Krolewiecka 2, Wroclaw',
    startsAt: '2026-07-10T18:00:00.000Z',
    durationMinutes: randomDuration(),
    price: 30,
    seatsTotal: 22,
    seatsTaken: 22
  },
  {
    id: 'g-tabletennis-psie-pole',
    title: 'Table tennis — Psie Pole',
    status: GAME_STATUS.OPEN,
    location: { lat: 51.146, lng: 17.093 },
    address: 'Krzywoustego 310, Wroclaw',
    startsAt: '2026-07-21T15:00:00.000Z',
    durationMinutes: randomDuration(),
    price: 10,
    seatsTotal: 8,
    seatsTaken: 7
  },
  {
    id: 'g-squash-midtown',
    title: 'Squash — Mid Town',
    status: GAME_STATUS.OPEN,
    location: { lat: 51.102, lng: 17.048 },
    address: 'Borowska 30, Wroclaw',
    startsAt: '2026-07-22T20:00:00.000Z',
    durationMinutes: randomDuration(),
    price: 35,
    seatsTotal: 2,
    seatsTaken: 0
  },
  {
    id: 'g-football-krakow',
    title: 'Football 5v5 — Krakow Blonia',
    status: GAME_STATUS.OPEN,
    location: { lat: 50.0602, lng: 19.9106 },
    address: 'Blonia, Krakow',
    startsAt: '2026-07-19T18:00:00.000Z',
    durationMinutes: randomDuration(),
    price: 25,
    seatsTotal: 10,
    seatsTaken: 2
  }
]

export { mockGames }
export type { IMockGame }
