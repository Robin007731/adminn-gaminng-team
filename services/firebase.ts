
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, onSnapshot, doc, updateDoc, deleteDoc, addDoc, serverTimestamp, increment } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAyGsnbyvxTEzvtgOXSmU_5Hj6gS6TOWKM",
    authDomain: "gaming-team-18b95.firebaseapp.com",
    projectId: "gaming-team-18b95",
    storageBucket: "gaming-team-18b95.appspot.com",
    messagingSenderId: "89183017486",
    appId: "1:89183017486:web:18b6258a2bf5c0bde97a5f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Export standard firestore utilities
export { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  serverTimestamp, 
  increment 
};
