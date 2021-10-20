import React from 'react';
// CSS
// import styles from '../ConnectX.module.css';

class Form extends React.Component {
	prepareInfos = event => {
		event.preventDefault();
		const width = parseInt(this.width.value);
		const height = parseInt(this.height.value);
		const minVal = width <= height ? width : height;
		const scoreTarget = Math.round(0.8 + 1.7 * Math.log((width + height) / 2));
		const gameInfos = {
			width: width,
			height: height,
			scoreTarget: minVal <= scoreTarget ? minVal : scoreTarget
			// scoreTarget: parseInt(this.scoreTarget.value)
		};
		this.props.sendGameSettings(gameInfos);

		// We clear the textarea
		this.infosForm.reset();
	};

	render() {
		return (
			<form 
				className="form"
				onSubmit={i => this.prepareInfos(i)}
				ref={i => this.infosForm = i}
			>
				<span>Largeur :</span>
				<input
					type="text" pattern="\b([3-9]|[12][0-9]|3[0-2])\b"
					maxLength={this.props.length}
					ref={i => this.width = i}
					placeholder=" 3-32"
					required
				/>
				<span>Hauteur :</span>
				<input
					type="text" pattern="\b([3-9]|[12][0-9]|3[0-2])\b"
					maxLength={this.props.length}
					ref={i => this.height = i}
					placeholder=" 3-32"
					required
				/>				
{/*				<input
					type="text" pattern="[0-9]*"
					maxLength={this.props.length}
					ref={i => this.scoreTarget = i}
				/>*/}

				<button type="submit" >
				</button>

			</form>
		)
	}

}

export default Form;