
// src/api/push-subscription.js
import { getMessaging, getToken } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialiser Firebase
initializeApp(firebaseConfig);

export const subscribeToPush = async () => {
  const messaging = getMessaging();
  const token = await getToken(messaging, {
    vapidKey: 'BL3VX5LZkaERWTPu3R6Ky8q2_2OVlvySUXSjb-eX09G7HCG3Ieggcr0XTRgM63gzn4wDQiH_Kq_3Klmy_TV4dOw',
  });

  // Vous pouvez enregistrer le token sur votre serveur ici
  return token;
};
