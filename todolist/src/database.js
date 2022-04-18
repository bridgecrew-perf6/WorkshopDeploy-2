// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXdkHMw8w3BqKmoAn94Kf93YtDT3Y09v8",
  authDomain: "todo-list-dd643.firebaseapp.com",
  projectId: "todo-list-dd643",
  storageBucket: "todo-list-dd643.appspot.com",
  messagingSenderId: "1037412888449",
  appId: "1:1037412888449:web:f661b0000de21f53284280",
  measurementId: "G-KDWL7WV84D",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
