import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";


// Firebase Configuration
const APIKEY = import.meta.env.VITE_APIKEY
const AUTHDOMAIN = import.meta.env.VITE_AUTHDOMAIN
const PROJECTID = import.meta.env.VITE_PROJECTID
const STORAGEBUCKET = import.meta.env.VITE_STORAGEBUCKET
const MESSAGINGSENDERID = import.meta.env.VITE_MESSAGINGSENDERID
const APPID = import.meta.env.VITE_MESSAGINGSENDERID
const MEASUREMENTID = import.meta.env.VITE_MEASUREMENTID
const firebaseConfig = {
    apiKey: APIKEY,
    authDomain: AUTHDOMAIN,
    projectId: PROJECTID,
    storageBucket: STORAGEBUCKET,
    messagingSenderId: MESSAGINGSENDERID,
    appId: APPID,
    measurementId: MEASUREMENTID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const auth = getAuth(app);

