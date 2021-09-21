import React from 'react';
import { saveState } from '../localStorage';
import history from '../history';
class Connexion extends React.Component {
	goToApp = event => {
		event.preventDefault();
		console.log(this);
		const pseudo = this.pseudoInput.value;
		saveState(pseudo);
		history.push(`/redux-project/`);
	};

	render() {
		return (
			<div className="connexionBox" onSubmit={(i) => this.goToApp(i)}>
				<form className="connexion" >
					<input
						type="text"
						placeholder="Pseudo"
						required
						ref={input => {this.pseudoInput = input}}/>
					<button type="submit">GO</button>
				</form>
			</div>
		)
	}
}

export default Connexion;