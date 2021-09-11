import React from 'react';
import history from '../history';
class Connexion extends React.Component {
	goToChat = event => {
		event.preventDefault();
		console.log(this);
		const pseudo = this.pseudoInput.value;
		history.push(`/redux-project/pseudo/${pseudo}`);
	};

	render() {
		return (
			<div className="connexionBox" onSubmit={(i) => this.goToChat(i)}>
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