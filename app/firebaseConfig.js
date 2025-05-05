// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDU0Elccke6IY1dlMGdbSAxgPnRNm4Gdxo",
  authDomain: "cs145-iotcup.firebaseapp.com",
  projectId: "cs145-iotcup",
  storageBucket: "cs145-iotcup.firebasestorage.app",
  messagingSenderId: "695263987135",
  appId: "1:695263987135:web:0c57e5a675ae4e6c070d0a",
  measurementId: "G-YCQ1Z7HVZ4"
};
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
