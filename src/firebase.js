// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration

// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyCVlUvESci3DdAWu04laKfVR88atfJrOms",
  authDomain: "kretan-app-88637.firebaseapp.com",
  projectId: "kretan-app-88637",
  storageBucket: "kretan-app-88637.firebasestorage.app",
  messagingSenderId: "121610372263",
  appId: "1:121610372263:web:ce87b264ca282d01d9c782"

};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const storage = getStorage(app);


export { db, storage };
