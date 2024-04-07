// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Optionally import the services that you want to use

// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBA0O6q2cir2AWdCQP36QnxYJa6LNxsLkU",
  authDomain: "pickhacks2024.firebaseapp.com",
  projectId: "pickhacks2024",
  storageBucket: "pickhacks2024.appspot.com",
  messagingSenderId: "626468301344",
  appId: "1:626468301344:web:e7b03450c441cf47792a45",
  measurementId: "G-KTZV4C4VER",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
