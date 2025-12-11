import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Set up persistence with proper error handling
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error("Firebase persistence setup failed:", err);
  console.warn("⚠️ Auth state will not persist across page reloads. User may need to log in again.");

  // Attempt to notify user if in browser environment
  if (typeof window !== "undefined") {
    // Store error state for components to check
    sessionStorage.setItem("firebase_persistence_failed", "true");
  }
});

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const microsoftProvider = new OAuthProvider("microsoft.com");

export { app, auth, googleProvider, facebookProvider, microsoftProvider };
