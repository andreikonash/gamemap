import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  runTransaction,
  updateDoc,
  where
} from 'firebase/firestore'
import { firestore } from '@/plugins/firebase'
import { REGISTRATION_STATUS, type IRegistration } from '@/types/booking'
import type { IGame } from '@/types/game'

const REGISTRATIONS_COLLECTION = 'registrations'
const GAMES_COLLECTION = 'games'

async function createRegistration (game: IGame, userId: string): Promise<IRegistration> {
  const registrationRef = doc(collection(firestore, REGISTRATIONS_COLLECTION))
  const registration: IRegistration = {
    id: registrationRef.id,
    gameId: game.id,
    userId,
    status: REGISTRATION_STATUS.PENDING_PAYMENT,
    gameTitle: game.title,
    gameStartsAt: game.startsAt,
    price: game.price,
    createdAt: new Date().toISOString()
  }

  await runTransaction(firestore, async (transaction) => {
    const gameRef = doc(firestore, GAMES_COLLECTION, game.id)
    const gameSnapshot = await transaction.get(gameRef)
    if (!gameSnapshot.exists()) throw new Error('game_not_found')

    const seatsTaken: number = gameSnapshot.data().seatsTaken
    const seatsTotal: number = gameSnapshot.data().seatsTotal
    if (seatsTaken >= seatsTotal) throw new Error('game_full')

    transaction.update(gameRef, { seatsTaken: seatsTaken + 1 })
    transaction.set(registrationRef, registration)
  })

  return registration
}

async function fetchMyRegistrations (userId: string): Promise<IRegistration[]> {
  const registrationsQuery = query(
    collection(firestore, REGISTRATIONS_COLLECTION),
    where('userId', '==', userId)
  )
  const snapshot = await getDocs(registrationsQuery)
  return snapshot.docs.map((docItem) => docItem.data() as IRegistration)
}

async function markRegistrationPaid (registrationId: string): Promise<void> {
  await updateDoc(doc(firestore, REGISTRATIONS_COLLECTION, registrationId), {
    status: REGISTRATION_STATUS.PAID
  })
}

async function cancelRegistration (registration: IRegistration): Promise<void> {
  const registrationRef = doc(firestore, REGISTRATIONS_COLLECTION, registration.id)

  await runTransaction(firestore, async (transaction) => {
    const gameRef = doc(firestore, GAMES_COLLECTION, registration.gameId)
    const gameSnapshot = await transaction.get(gameRef)

    if (gameSnapshot.exists()) {
      const seatsTaken: number = gameSnapshot.data().seatsTaken
      transaction.update(gameRef, { seatsTaken: Math.max(seatsTaken - 1, 0) })
    }
    transaction.delete(registrationRef)
  })
}

async function deleteMyRegistrations (userId: string): Promise<void> {
  const registrations = await fetchMyRegistrations(userId)
  await Promise.all(registrations.map((registration) => deleteDoc(doc(firestore, REGISTRATIONS_COLLECTION, registration.id))))
}

async function fetchGameRegistrations (gameId: string): Promise<IRegistration[]> {
  const registrationsQuery = query(
    collection(firestore, REGISTRATIONS_COLLECTION),
    where('gameId', '==', gameId)
  )
  const snapshot = await getDocs(registrationsQuery)
  return snapshot.docs.map((docItem) => docItem.data() as IRegistration)
}

export {
  createRegistration,
  fetchMyRegistrations,
  markRegistrationPaid,
  cancelRegistration,
  deleteMyRegistrations,
  fetchGameRegistrations
}
