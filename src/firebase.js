

import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyDH36pIwAfS2Wa588dtRhywmxOeXB7OKUg",

  authDomain: "kankuin-974b4.firebaseapp.com",

  projectId: "kankuin-974b4",

  storageBucket: "kankuin-974b4.firebasestorage.app",

  messagingSenderId: "304655558377",

  appId: "1:304655558377:web:a2e27bff1f579f566fb278",

  measurementId: "G-35G3KYE1LM"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);