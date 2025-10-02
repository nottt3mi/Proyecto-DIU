// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAK6jXqQVNe39XdX1TQf0WbqOa6NIyNwRw",
  authDomain: "helpers-95b5e.firebaseapp.com",
  projectId: "helpers-95b5e",
  storageBucket: "helpers-95b5e.firebasestorage.app",
  messagingSenderId: "428039555581",
  appId: "1:428039555581:web:769fd069dd64b709c23194",
  measurementId: "G-MSREJYE1VL"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

