import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  getFirestore,
  orderBy,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyAtQpcwbDBL2DtpQ7ZBiOkwj_jlwEMt3jE",
  authDomain: "btr-database.firebaseapp.com",
  projectId: "btr-database",
  storageBucket: "btr-database.firebasestorage.app",
  messagingSenderId: "152168510677",
  appId: "1:152168510677:web:012fe1f89b4d700dccde5c",
  measurementId: "G-EE9GVQRX6T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


export { 
  db, 
  auth, 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  where, 
  addDoc, 
  sendEmailVerification,
  sendPasswordResetEmail,
  getAuth
};