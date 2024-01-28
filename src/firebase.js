// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-0UjwAxnabt9viV1tXXqfJfMDVb4FRC8",
  authDomain: "realtor-clone-3d8c4.firebaseapp.com",
  projectId: "realtor-clone-3d8c4",
  storageBucket: "realtor-clone-3d8c4.appspot.com",
  messagingSenderId: "731692525437",
  appId: "1:731692525437:web:dc310a5cf4199669f14e14",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
