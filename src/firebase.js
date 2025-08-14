// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth"; // ✅ For authentication

// Your web app's Firebase configuration
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

// Export Firebase services
export const storage = getStorage(app); // ✅ Firebase Storage
export const auth = getAuth(app);       // ✅ Firebase Authentication
