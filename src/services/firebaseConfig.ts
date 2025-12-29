import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth'; // Uncomment when auth is needed

// Configuration derived from google-services.json and standard Firebase patterns
const firebaseConfig = {
    apiKey: "AIzaSyAdFAdYxOdDlKfNqHz7wBIrTl3vuEdNnGI",
    authDomain: "tmklinikkenapp.firebaseapp.com",
    projectId: "tmklinikkenapp",
    storageBucket: "tmklinikkenapp.firebasestorage.app",
    messagingSenderId: "676907748776",
    appId: "1:676907748776:android:28d61075d28de054c2e19d", // Note: This is Android App ID. Web App ID is preferred for JS SDK but this may work for Firestore.
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
// export const auth = getAuth(app); 

export default app;
