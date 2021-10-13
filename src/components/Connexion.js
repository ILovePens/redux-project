import React from 'react';
import { saveSessionItems } from '../localStorage';
import history from '../history';
// CSS
// import './App.css';

class Connexion extends React.Component {
	goToApp = event => {
		event.preventDefault();
		console.log(this);
		const pseudo = this.pseudoInput.value;
		saveSessionItems({pseudo:pseudo, stamp:(+new Date()).toString(36)}, 'playerInfos');
		history.push(`/redux-project/`);
	};

	render() {
		return (
			<div className="connexionBox">
			    <header className="App-header">
			      <h1 className="logo">Redux-progress</h1>
			    </header>
			    <p>Hi! I'm Maxime Sarrazin, and this is Redux-progress, a work in progress of mini-games made with React and Redux, as a part of my learning journey of Javascript and complex application building. Please enter a name below to proceed to the games, as it will be shown to your opponent when playing a versus game online.</p>
				<form className="form connexion" onSubmit={(i) => this.goToApp(i)}>
					<input
						type="text"
						placeholder="Pseudo"
						required
						ref={input => {this.pseudoInput = input}}/>
					<button type="submit"></button>
				</form>
			</div>
		)
	}
}

export default Connexion;