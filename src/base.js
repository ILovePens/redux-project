import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: "AIzaSyDVe3axD8Y3GnxcnsnDuDz_FHCKYJcu6gg",
  authDomain: "redux-project-98a9a.firebaseapp.com",
  databaseURL: "https://redux-project-98a9a-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "redux-project-98a9a",
  storageBucket: "redux-project-98a9a.appspot.com",
  messagingSenderId: "67646127878",
  appId: "1:67646127878:web:507ecc4c86993503ca2887",
  measurementId: "G-34QJSE84ZR"
};

const app = initializeApp(firebaseConfig);
const base = getFirestore(app);

export default base;