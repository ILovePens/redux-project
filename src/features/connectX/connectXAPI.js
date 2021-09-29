import { getDatabase, ref, get} from "firebase/database";

export function readPlayers() {
	const db = getDatabase();
  return new Promise((resolve) => {  	
		get(ref(db, `/players`)).then((players) => {
			if (players.exists()) {
				resolve(players.val());    
		  } else {
		    console.log("No data available");
		  }
		}).catch((error) => {
		  console.error(error);
		});
  });
}

export function compareGameState(turnData) {
	const db = getDatabase();
  return new Promise((resolve) => {
		get(ref(db, `/turnAction`)).then((readTurnAction) => {
			if (readTurnAction.exists()) {
				get(ref(db, `/stepNumber`)).then((readStepNumber) => {
					if (readStepNumber.exists()) {
		        if(readTurnAction.val() !== turnData.turnAction || readStepNumber.val() !== turnData.stepNumber) {
					    get(ref(db, `/`)).then((dataSnapshot) => {
								if (dataSnapshot.exists()) {
			        		resolve(dataSnapshot.val());
							  } else {
							    console.log("No data available");
							  }
					    }).catch((error) => {
							  console.error(error);
							});
				    } else {
					    get(ref(db, `/players`)).then((readPlayers) => {
								if (readPlayers.exists() && readPlayers.val() === 0) {
			        		resolve(0);
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
		  } else {
		    console.log("No data available");
		  }
		}).catch((error) => {
		  console.error(error);
		});
	});
}

export function readGameState(isInit) {
	const db = getDatabase();
  return new Promise((resolve) => {  	
		get(ref(db, `/players`)).then((players) => {
			if (players.exists()) {
				if (isInit) {
					resolve({players: players.val()});
				} else {
					get(ref(db, `/gameSettings`)).then((gameSettings) => {
						if (gameSettings.exists()) {
							get(ref(db, `/gameIsOn`)).then((snapshot) => {
								if (snapshot.exists()) {
							    resolve({players: players.val(), gameSettings: gameSettings.val(), gameIsOn: snapshot.val()});
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
				}
		  } else {
		    console.log("No data available");
		  }
		}).catch((error) => {
		  console.error(error);
		});
  });
}
