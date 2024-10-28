// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDzv_LUBeWx33dYuPLjlsTEV_ueDe7Vme4",
  authDomain: "tbfiscal-3cf9d.firebaseapp.com",
  projectId: "tbfiscal-3cf9d",
  storageBucket: "tbfiscal-3cf9d.appspot.com",
  messagingSenderId: "193333685760",
  appId: "1:193333685760:web:dac76e493a8f9da23572e5",
  measurementId: "G-SNKQ5C0HYJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
