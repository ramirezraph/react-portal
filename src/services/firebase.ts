import { initializeApp } from 'firebase/app';
import { collection, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBI3S9rDGBYhl8ihy6xPI2015O-3I4rHhM',
  authDomain: 'student-portal-78708.firebaseapp.com',
  projectId: 'student-portal-78708',
  storageBucket: 'student-portal-78708.appspot.com',
  messagingSenderId: '428377907903',
  appId: '1:428377907903:web:e3be29ccba9f42de659c0a',
  measurementId: 'G-8QMHQ9H1HP',
};

// setup firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

// collection references
const classesColRef = collection(db, 'classes');
const usersColRef = collection(db, 'users');
const lessonsColRef = collection(db, 'lessons');
const filesColRef = collection(db, 'files');

export {
  app,
  db,
  storage,
  classesColRef,
  usersColRef,
  lessonsColRef,
  filesColRef,
};
