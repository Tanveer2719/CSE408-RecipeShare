import 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apikey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "recipeshare-410617.firebaseapp.com",
    projectId:process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: "gs://recipeshare-410617.appspot.com",
    messagingSenderId:process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId:process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId:process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
  };

    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    
    export default {app,storage};