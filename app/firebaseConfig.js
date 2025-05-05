// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCXVatql4xb0sgh7HKUGwva1qVvEanUdfg",
    authDomain: "stickersmash-648fc.firebaseapp.com",
    projectId: "stickersmash-648fc",
    storageBucket: "stickersmash-648fc.firebasestorage.app",
    messagingSenderId: "970412997500",
    appId: "1:970412997500:web:94fb59f56fc7d2be4c82f9",
    measurementId: "G-PH4BFG6KT2"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
