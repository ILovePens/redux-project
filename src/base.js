import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: "AIzaSyBcbjihs9sz2r212hEj8Dh1IjeDKfRqy7U",
  authDomain: "redux-progress.firebaseapp.com",
  databaseURL: "https://redux-progress-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "redux-progress",
  storageBucket: "redux-progress.appspot.com",
  messagingSenderId: "1056425097273",
  appId: "1:1056425097273:web:26f5d8fe70bfe09b8cf5e8"
};

const app = initializeApp(firebaseConfig);
const base = getFirestore(app);

export default base;
