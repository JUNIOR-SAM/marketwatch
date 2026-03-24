import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; 

const firebaseConfig = {
  apiKey: "AIzaSyARikN9OhfcAg5eEPavrA0E07-pn6yszro",
  authDomain: "marketwatch-cba41.firebaseapp.com",
  projectId: "marketwatch-cba41",
  storageBucket: "marketwatch-cba41.firebasestorage.app",
  messagingSenderId: "786785667209",
  appId: "1:786785667209:web:fc2e5396e11c39151b1e58"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();