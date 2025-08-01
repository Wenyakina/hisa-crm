import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC33JQ0DFIm4OkiSucLBEjRZgMgi_L_3Xg",
    authDomain: "hisastockapp.firebaseapp.com",
    projectId: "hisastockapp",
    storageBucket: "hisastockapp.firebasestorage.app",
    messagingSenderId: "768257574483",
    appId: "1:768257574483:web:8d7a3cb1a26f6c2a46e8a6",
    measurementId: "G-XTR3GX8WP0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
