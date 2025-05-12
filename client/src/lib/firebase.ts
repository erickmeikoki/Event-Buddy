import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  User
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
  limit,
  Timestamp
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Get Firebase API credentials from environment variables
// Handle browser-side environment variables differently from server-side
const isClient = typeof window !== 'undefined';

// Only access import.meta.env on the client side
const getEnv = (key: string, fallback: string): string => {
  if (isClient && import.meta && import.meta.env) {
    return import.meta.env[key] || fallback;
  }
  
  // On server side, try to get from process.env
  if (!isClient && process && process.env) {
    return process.env[key] || fallback;
  }
  
  return fallback;
};

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY', "placeholder-api-key"),
  authDomain: `${getEnv('VITE_FIREBASE_PROJECT_ID', "placeholder-project")}.firebaseapp.com`,
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID', "placeholder-project"),
  storageBucket: `${getEnv('VITE_FIREBASE_PROJECT_ID', "placeholder-project")}.appspot.com`,
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID', "placeholder-sender-id"),
  appId: getEnv('VITE_FIREBASE_APP_ID', "placeholder-app-id")
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Function to sign in with Google using a popup
const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

// Function to sign in with Google using a redirect (better for mobile)
const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);

export {
  app,
  auth,
  db,
  storage,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithGoogle,
  signInWithGoogleRedirect,
  getRedirectResult,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
  limit,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  Timestamp
};

export type FirebaseUser = User;
