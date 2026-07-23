import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  type DocumentData
} from 'firebase/firestore'
import { firestore } from '@/plugins/firebase'
import { resolveGameStatus } from '@/utils/helpers/gameStatus'
import { GAME_STATUS } from '@/types/game'
import type { IGame, INewGame } from '@/types/game'

const GAMES_COLLECTION = 'games'

function mapGame (id: string, data: DocumentData): IGame {
  return {
    id,
    title: data.title,
    status: resolveGameStatus(data.status, data.seatsTotal, data.seatsTaken),
    location: { lat: data.location.lat, lng: data.location.lng },
    address: data.address,
    startsAt: data.startsAt,
    durationMinutes: data.durationMinutes,
    price: data.price,
    seatsTotal: data.seatsTotal,
    seatsTaken: data.seatsTaken,
    organizerId: data.organizerId
  }
}

async function fetchGames (): Promise<IGame[]> {
  const snapshot = await getDocs(collection(firestore, GAMES_COLLECTION))
  return snapshot.docs.map((docItem) => mapGame(docItem.id, docItem.data()))
}

function subscribeToGames (callback: (games: IGame[]) => void) {
  return onSnapshot(collection(firestore, GAMES_COLLECTION), (snapshot) => {
    callback(snapshot.docs.map((docItem) => mapGame(docItem.id, docItem.data())))
  })
}

async function fetchGame (id: string): Promise<IGame | null> {
  const snapshot = await getDoc(doc(firestore, GAMES_COLLECTION, id))
  if (!snapshot.exists()) return null
  return mapGame(snapshot.id, snapshot.data())
}

async function addGame (draft: INewGame): Promise<IGame> {
  const data = { ...draft, status: GAME_STATUS.OPEN, seatsTaken: 0 }
  const docRef = await addDoc(collection(firestore, GAMES_COLLECTION), data)
  return mapGame(docRef.id, data)
}

async function fetchGamesByOrganizer (organizerId: string): Promise<IGame[]> {
  const organizerQuery = query(
    collection(firestore, GAMES_COLLECTION),
    where('organizerId', '==', organizerId)
  )
  const snapshot = await getDocs(organizerQuery)
  return snapshot.docs.map((docItem) => mapGame(docItem.id, docItem.data()))
}

export { fetchGames, subscribeToGames, fetchGame, addGame, fetchGamesByOrganizer, mapGame }
