import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Using initializeFirestore with specialized settings to fix "Could not reach Cloud Firestore backend" in sandboxed environments
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, (firebaseConfig as any).firestoreDatabaseId);

export const auth = getAuth(app);

/**
 * Validates connection to Firestore on boot as per guidelines
 */
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firestore Quantum Link: ACTIVE");
  } catch (error: any) {
    if (error.code === 'unavailable') {
      console.warn("Firestore Quantum Link: OFFLINE. Operating in local buffer mode.");
    } else if (error.code === 'permission-denied') {
      console.warn("Firestore Quantum Link: SECURED. Initial handshake completed.");
    } else {
      console.error("Firestore Quantum Link: INTERFERENCE DETECTED.", error);
    }
  }
}

if (typeof window !== 'undefined') {
  testConnection();
}
