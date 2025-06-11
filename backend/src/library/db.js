// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEtYOYOYeIkIwCqexL9IE806_D7eZkBg4",
  authDomain: "crud-node-database-63741.firebaseapp.com",
  projectId: "crud-node-database-63741",
  storageBucket: "crud-node-database-63741.firebasestorage.app",
  messagingSenderId: "280938355040",
  appId: "1:280938355040:web:365233130c1e99f3eca605",
  measurementId: "G-MR33Q63EHJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);