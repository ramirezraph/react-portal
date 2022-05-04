// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBI3S9rDGBYhl8ihy6xPI2015O-3I4rHhM',
  authDomain: 'student-portal-78708.firebaseapp.com',
  projectId: 'student-portal-78708',
  storageBucket: 'student-portal-78708.appspot.com',
  messagingSenderId: '428377907903',
  appId: '1:428377907903:web:e3be29ccba9f42de659c0a',
  measurementId: 'G-8QMHQ9H1HP',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
const firestore = getFirestore(firebaseApp);

export { firebaseApp, analytics, firestore };
