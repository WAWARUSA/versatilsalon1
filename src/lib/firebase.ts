import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Configuración de Firebase (misma que la app de escritorio)
const firebaseConfig = {
  apiKey: "AIzaSyDh3UjLGj4NmPhKATl33XemuhKyR-yAB2Q",
  authDomain: "versatilsalon-app.firebaseapp.com",
  projectId: "versatilsalon-app",
  storageBucket: "versatilsalon-app.firebasestorage.app",
  messagingSenderId: "615091902081",
  appId: "1:615091902081:web:64d7cb6be9d56cd4345f80",
  measurementId: "G-R1ZB5PK7ZT"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;

