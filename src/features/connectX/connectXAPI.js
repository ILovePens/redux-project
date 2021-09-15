import base from '../../base';
// A mock function to mimic making an async request for data
export function readStepnumberChange() {
  return new Promise((resolve) => {
		base.ref(`/stepNumber`).on('value', snapshot => {
			resolve(snapshot.val());
		});

		// base.ref(`/stepNumber`)
  //     .once('value')
  //     .then(function(snapshot) {
		// 	resolve(snapshot.val());
		// });		
	});
}