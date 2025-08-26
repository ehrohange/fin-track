// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "fintrack-596c9.firebaseapp.com",
  projectId: "fintrack-596c9",
  storageBucket: "fintrack-596c9.firebasestorage.app",
  messagingSenderId: "703583755967",
  appId: "1:703583755967:web:45cfc5bf35226d640d300a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);