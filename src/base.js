import Rebase from 're-base';
import firebase from 'firebase/app';

import 'firebase/database';
// Add onValue event to the history and gravity to watch for the opponent move
// Maybe add onValue to a new state related to a game happening between players :
// By turning it on, a pop up appears prompting for a player
// If it's on, goToStep and sendGamesettings are unavailable until the game ends
// All controls are diasbled when it's not your turn or if a game is happening

var app = firebase.initializeApp({
    apiKey: "AIzaSyCO95cQgExyjn1RjZQzrcJtsY1XagkH7as",
    authDomain: "tuto-chatbox-b2f4c.firebaseapp.com",
    databaseURL: "https://tuto-chatbox-b2f4c-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "tuto-chatbox-b2f4c",
    storageBucket: "tuto-chatbox-b2f4c.appspot.com",
    messagingSenderId: "790203317802"
});
var base = Rebase.createClass(app.database());

export default base;