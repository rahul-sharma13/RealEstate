// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-185f1.firebaseapp.com",
  projectId: "real-estate-185f1",
  storageBucket: "real-estate-185f1.appspot.com",
  messagingSenderId: "1066355875469",
  appId: "1:1066355875469:web:cd2f647f74ccb3dd184cc4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);