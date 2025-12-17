// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqJhuHKztCsIhP-Ug04M6aTRYEw2-wv9I",
  authDomain: "vocaai-51563.firebaseapp.com",
  projectId: "vocaai-51563",
  storageBucket: "vocaai-51563.firebasestorage.app",
  messagingSenderId: "467409926794",
  appId: "1:467409926794:web:5bf3a691a657e7dc574b73",
  measurementId: "G-WPC35361VT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);