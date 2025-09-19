import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

/**
 * Inicializa Firebase una sola vez y retorna la instancia de Firestore
 * Evita la doble inicialización verificando si ya existe una app activa
 */
export function initializeFirebase(): Firestore {
  // Verificar si ya existe una app inicializada
  if (getApps().length > 0) {
    app = getApps()[0];
  } else {
    // Solo inicializar si no existe ninguna app
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    };

    app = initializeApp(firebaseConfig);
  }

  // Obtener o crear instancia de Firestore
  if (!db) {
    db = getFirestore(app);
  }

  return db;
}

/**
 * Obtiene la instancia de Firestore
 * Inicializa Firebase si no está inicializado
 */
export function getFirestoreDB(): Firestore {
  if (!db) {
    return initializeFirebase();
  }
  return db;
}

/**
 * Obtiene la ruta del documento de tasas de cambio desde variables de entorno
 */
export function getRatesDocumentPath(): string {
  return import.meta.env.VITE_FIRESTORE_RATES_DOC_PATH || "rates/current";
}
