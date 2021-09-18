import { getDatabase, ref, get} from "firebase/database";

export function compareGameState(stepNumber) {
	const db = getDatabase();
  return new Promise((resolve) => {
    get(ref(db, `/players`)).then((playersSnapshot) => {
			if (playersSnapshot.exists()) {
				get(ref(db, `/stepNumber`)).then((readStepNumber) => {
					if (readStepNumber.exists()) {
		        if(readStepNumber.val() !== stepNumber) {
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

		  } else {
			  resolve(null);
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
