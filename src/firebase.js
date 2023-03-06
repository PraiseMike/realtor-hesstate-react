// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzSB_2ZiKiRU5AdGUYV7KpjmQAvL-UzFU",
  authDomain: "hesstate-react.firebaseapp.com",
  projectId: "hesstate-react",
  storageBucket: "hesstate-react.appspot.com",
  messagingSenderId: "734340829797",
  appId: "1:734340829797:web:1ba45f4b208567aa8a6c8c"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()