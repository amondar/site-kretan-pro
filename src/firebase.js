// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyDJ6-sbpU7IVk_Y0ktegr52sSCP-GP5S6o",
  authDomain: "kretan-app.firebaseapp.com",
  projectId: "kretan-app",
  storageBucket: "kretan-app.firebasestorage.app",
  messagingSenderId: "122939699267",
  appId: "1:122939699267:web:03aab0713c04a75fee64f6"

};

// Initialisation
const app = initializeApp(firebaseConfig);
// On exporte l'outil de base de données pour l'utiliser ailleurs
export const db = getFirestore(app);