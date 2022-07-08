import { initializeApp } from 'firebase/app'
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  GithubAuthProvider,
  getAuth
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'
import { getStorage } from 'firebase/storage'
import firebaseConfig from 'configs/FirebaseConfig'

const app = initializeApp(firebaseConfig)

// firebase utils
const firestore = getFirestore(app)
const db = getDatabase()
const auth = getAuth(app)
const storage = getStorage()
const currentUser = auth.currentUser
const googleAuthProvider = new GoogleAuthProvider()
const facebookAuthProvider = new FacebookAuthProvider()
const twitterAuthProvider = new TwitterAuthProvider()
const githubAuthProvider = new GithubAuthProvider()

export {
  firestore,
  db,
  auth,
  storage,
  currentUser,
  googleAuthProvider,
  facebookAuthProvider,
  twitterAuthProvider,
  githubAuthProvider
}
