import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBA0O6q2cir2AWdCQP36QnxYJa6LNxsLkU",
  authDomain: "pickhacks2024.firebaseapp.com",
  databaseURL: "https://pickhacks2024-default-rtdb.firebaseio.com", // Ensure this is correct
  projectId: "pickhacks2024",
  storageBucket: "pickhacks2024.appspot.com",
  messagingSenderId: "626468301344",
  appId: "1:626468301344:web:e7b03450c441cf47792a45",
  measurementId: "G-KTZV4C4VER",
};

// Initialize Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const realtimeDb = getDatabase(app);

export { realtimeDb };
