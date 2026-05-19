import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCe1kvEe90S9mdXdm1ezph5u3BxDzTHO4I",
  authDomain: "mpikuliah-756.firebaseapp.com",
  projectId: "mpikuliah-756",
  storageBucket: "mpikuliah-756.firebasestorage.app",
  messagingSenderId: "225349317475",
  appId: "1:225349317475:web:abdc0700119100171ed956",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
