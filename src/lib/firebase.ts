import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

// Configuracion de Firebase usando variables de entorno o valores por defecto
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDh3UjLGj4NmPhKATl33XemuhKyR-yAB2Q",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "versatilsalon-app.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "versatilsalon-app",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "versatilsalon-app.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "615091902081",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:615091902081:web:64d7cb6be9d56cd4345f80",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-R1ZB5PK7ZT"
};

// Inicializar Firebase solo en el cliente y evitar multiples inicializaciones
let app: FirebaseApp | undefined;
let db: Firestore | null = null;
let auth: Auth | null = null;

if (typeof window !== 'undefined') {
  // Solo ejecutar en el cliente
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  
  db = getFirestore(app);
  auth = getAuth(app);
}

export { db, auth };
export default app;

