// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDzv_LUBeWx33dYuPLjlsTEV_ueDe7Vme4",
  authDomain: "tbfiscal-3cf9d.firebaseapp.com",
  projectId: "tbfiscal-3cf9d",
  storageBucket: "tbfiscal-3cf9d.appspot.com",
  messagingSenderId: "193333685760",
  appId: "1:193333685760:web:dac76e493a8f9da23572e5",
  measurementId: "G-SNKQ5C0HYJ"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider(); // Google Auth Provider
const storage = getStorage(app);

// Export the services for use
export { db, auth, provider, storage };
