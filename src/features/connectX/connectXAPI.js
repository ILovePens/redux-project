import { getDatabase, ref, get} from "firebase/database";

export function compareGameState(turnAction) {
	const db = getDatabase();
  return new Promise((resolve) => {
		get(ref(db, `/turnAction`)).then((readTurnAction) => {
			if (readTurnAction.exists()) {
        if(readTurnAction.val() !== turnAction) {
			    get(ref(db, `/`)).then((dataSnapshot) => {
						if (dataSnapshot.exists()) {
	        		resolve(dataSnapshot.val());
					  } else {
					    console.log("No data available");
					  }
			    }).catch((error) => {
					  console.error(error);
					});
		    }
		  } else {
		    console.log("No data available");
		  }
		}).catch((error) => {
		  console.error(error);
		});
	});
}

export function readPlayers() {
	const db = getDatabase();
  return new Promise((resolve) => {  	
		get(ref(db, `/players`)).then((players) => {
			if (players.exists()) {
				get(ref(db, `/gameIsOn`)).then((snapshot) => {
					if (snapshot.exists()) {
				    resolve({players: players.val(), gameIsOn: snapshot.val()});
				  } else {
				    console.log("No data available");
				  }
				}).catch((error) => {
				  console.error(error);
				});		    
		  } else {
		    console.log("No data available");
		  }
		}).catch((error) => {
		  console.error(error);
		});
  });
}
