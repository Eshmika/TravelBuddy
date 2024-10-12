import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore'; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyAgykUnUG_Z1FaeWR_boO-1sKAtHkks7Lo",
  authDomain: "travel-app-7d8f3.firebaseapp.com",
  projectId: "travel-app-7d8f3",
  storageBucket: "travel-app-7d8f3.appspot.com",
  messagingSenderId: "973904107630",
  appId: "1:973904107630:web:cd2ebff38a899b907b6e7f",
  measurementId: "G-NNB06D2E8R"
};

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
}

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };



