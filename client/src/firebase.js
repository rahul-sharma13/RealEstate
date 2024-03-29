import { initializeApp } from "firebase/app";

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