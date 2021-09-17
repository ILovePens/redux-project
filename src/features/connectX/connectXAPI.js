import { getDatabase, ref, get} from "firebase/database";

export function readStepnumber(stepNumber) {
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


    // onValue(ref(getDatabase(), `/stepNumber`), (snapshot) => {
    //   var data = snapshot.val();
    //   console.log("snapshot",data);
    //   resolve(data);
    // }/*, {
    //   onlyOnce: true
    // }*/);
  });
}

export function readPlayers() {
  return new Promise((resolve) => {  	
		get(ref(getDatabase(), `/players`)).then((snapshot) => {
			if (snapshot.exists()) {
		    var data = snapshot.val();
		    // console.log("snapshot",data);
		    resolve(data);
		  } else {
		    console.log("No data available");
		  }
		}).catch((error) => {
		  console.error(error);
		});
    // onValue(ref(getDatabase(), `/stepNumber`), (snapshot) => {
    //   var data = snapshot.val();
    //   console.log("snapshot",data);
    //   resolve(data);
    // }/*, {
    //   onlyOnce: true
    // }*/);
  });
}
