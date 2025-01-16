import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

    apiKey: "AIzaSyBVseH1CooJVWCgHHOK-AWA0RhSwOAqMzY",
  
    authDomain: "show-kai.firebaseapp.com",
  
    projectId: "show-kai",
  
    storageBucket: "show-kai.firebasestorage.app",
  
    messagingSenderId: "70087097665",
  
    appId: "1:70087097665:web:abb85ca65f0451966735c0",
  
    measurementId: "G-J8T0CS8TH9"
  
  };

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);