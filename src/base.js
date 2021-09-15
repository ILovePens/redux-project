// import Rebase from 're-base';

// import firebase from 'firebase/app';
// import { initializeApp } from 'firebase/app';
// import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

// const database = getDatabase();
// import 'firebase/database';
// Add onValue event to the history and gravity to watch for the opponent move
// Maybe add onValue to a new state related to a game happening between players :
// By turning it on, a pop up appears prompting for a player
// If it's on, goToStep and sendGamesettings are unavailable until the game ends
// All controls are diasbled when it's not your turn or if a game is happening


// import Rebase from 're-base';
import firebase from 'firebase/app';

import 'firebase/database';

var app = firebase.initializeApp({
  apiKey: "AIzaSyDVe3axD8Y3GnxcnsnDuDz_FHCKYJcu6gg",
  authDomain: "redux-project-98a9a.firebaseapp.com",
  databaseURL: "https://redux-project-98a9a-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "redux-project-98a9a",
  storageBucket: "redux-project-98a9a.appspot.com",
  messagingSenderId: "67646127878",
  appId: "1:67646127878:web:507ecc4c86993503ca2887",
  measurementId: "G-34QJSE84ZR"
});
// var base = Rebase.createClass(app.database());
var base = app.database();

export default base;