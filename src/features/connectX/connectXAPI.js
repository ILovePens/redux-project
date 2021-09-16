import { getDatabase, ref, get} from "firebase/database";

export function readStepnumber() {
  return new Promise((resolve) => {
		get(ref(getDatabase(), `/stepNumber`)).then((snapshot) => {
			if (snapshot.exists()) {
		    var data = snapshot.val();
		    console.log("snapshot",data);
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

export function readPlayers() {
  return new Promise((resolve) => {  	
		get(ref(getDatabase(), `/players`)).then((snapshot) => {
			if (snapshot.exists()) {
		    var data = snapshot.val();
		    console.log("snapshot",data);
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
