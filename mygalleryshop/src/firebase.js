// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_i-BfZMKuCumgnjffbxPpK-eipTV0ai8",
  authDomain: "my-gallery-b56b0.firebaseapp.com",
  projectId: "my-gallery-b56b0",
  storageBucket: "my-gallery-b56b0.appspot.com",
  messagingSenderId: "1082749362301",
  appId: "1:1082749362301:web:d3f0638d65516758505114",
  measurementId: "G-LHE49MYB05"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage =getStorage(app)