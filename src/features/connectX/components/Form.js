import React from 'react';
// CSS
import styles from '../ConnectX.module.css';

class Form extends React.Component {
	prepareInfos = event => {
		event.preventDefault();

		const gameInfos = {
			width: parseInt(this.width.value),
			height: parseInt(this.height.value),
			scoreTarget: parseInt(this.scoreTarget.value)
		};
		this.props.sendGameSettings(gameInfos);

		// We clear the textarea
		this.infosForm.reset();
	};

	render() {
		return (
			<form 
				className={styles.form}
				onSubmit={i => this.prepareInfos(i)}
				ref={i => this.infosForm = i}
			>

				<input
					type="text" pattern="[0-9]*"
					maxLength={this.props.length}
					ref={i => this.width = i}
				/>
				<input
					type="text" pattern="[0-9]*"
					maxLength={this.props.length}
					ref={i => this.height = i}
				/>				
				<input
					type="text" pattern="[0-9]*"
					maxLength={this.props.length}
					ref={i => this.scoreTarget = i}
				/>

				<button type="submit" >
						Envoyer!
				</button>

			</form>
		)
	}

}

export default Form;