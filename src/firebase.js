import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// On importe les outils de persistance ici
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth"; 

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// On crée une deuxième instance auth pour créer des comptes employés sans déconnecter l'admin
const secondaryAuth = getAuth(app); 

// LE CORRECTIF EST ICI : On force la mémoire du navigateur de manière asynchrone
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("Mémoire Firebase activée !"))
  .catch((error) => console.error("Erreur de mémoire Firebase:", error));

export { db, auth, secondaryAuth };