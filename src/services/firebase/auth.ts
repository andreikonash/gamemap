import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  deleteUser
} from 'firebase/auth'
import { firebaseAuth } from '@/plugins/firebase'
import type { ISessionUser } from '@/types/auth'

function signInWithGoogle () {
  return signInWithPopup(firebaseAuth, new GoogleAuthProvider())
}

function signInWithEmail (email: string, password: string) {
  return signInWithEmailAndPassword(firebaseAuth, email, password)
}

function signUpWithEmail (email: string, password: string) {
  return createUserWithEmailAndPassword(firebaseAuth, email, password)
}

function signOutUser () {
  return signOut(firebaseAuth)
}

function resetPassword (email: string) {
  return sendPasswordResetEmail(firebaseAuth, email)
}

function deleteAccountUser () {
  if (!firebaseAuth.currentUser) throw new Error('no_current_user')
  return deleteUser(firebaseAuth.currentUser)
}

async function fetchIsSuperAdmin (): Promise<boolean> {
  if (!firebaseAuth.currentUser) return false
  const tokenResult = await firebaseAuth.currentUser.getIdTokenResult()
  return tokenResult.claims.admin === true
}

function onSessionChange (callback: (user: ISessionUser | null) => void) {
  return onAuthStateChanged(firebaseAuth, (user) => {
    callback(user ? { uid: user.uid, email: user.email, displayName: user.displayName } : null)
  })
}

export {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  onSessionChange,
  resetPassword,
  deleteAccountUser,
  fetchIsSuperAdmin
}
