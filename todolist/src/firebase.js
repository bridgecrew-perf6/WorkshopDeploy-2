// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  //YOUR FIREBASE CONFIG HERE
  apiKey: "AIzaSyACBOCgYOcBD9jrethXGc9UB0BJfk5gW6g",
  authDomain: "todolist-f07fe.firebaseapp.com",
  projectId: "todolist-f07fe",
  storageBucket: "todolist-f07fe.appspot.com",
  messagingSenderId: "716109897572",
  appId: "1:716109897572:web:6d15bdfd3023e88e282471",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
