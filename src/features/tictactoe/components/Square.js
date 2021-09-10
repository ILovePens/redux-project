import React from 'react';
import styles from '../Tictactoe.module.css';

function Square(props) {
	let squareWinClass = "";
	if(props.winSquares) {
	squareWinClass = (props.winSquares).find(e => e === props.index) + 1 ? " " + styles.win : "";
		// +1 is here to avoid a failed test when the square indexed "0" is part of the winning squares
	}
  return (
    <button
    	className={styles.square + squareWinClass}
    	onClick={props.onClick} //this is not html onClick
    >
      {props.value}
    </button>
  );
}

export default Square;