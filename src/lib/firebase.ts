import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration provided by user
const firebaseConfig = {
    apiKey: "AIzaSyCaENioDqNibnD6RGDt5NznyZU7u-MN4jw",
    authDomain: "sciads-os.firebaseapp.com",
    projectId: "sciads-os",
    storageBucket: "sciads-os.firebasestorage.app",
    messagingSenderId: "54776379177",
    appId: "1:54776379177:web:f57bee1c7c905c25dfe938",
    measurementId: "G-9HN6BMYSKY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
