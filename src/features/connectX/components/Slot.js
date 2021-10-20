import React from 'react';
// CSS
import styles from '../ConnectX.module.css';

function Slot(props) {

		// FALL ANIMATION //
		const slotScore = props.slotScore;
		let transitionClass = "";
		let speed = 0
		if (slotScore) {
			transitionClass = `${styles.hasTransition} ${styles.fall}`;
			speed = Math.round((0.16 + 0.189 * Math.log(slotScore)) * 10) / 10;
		}

		// DISPLAY SLOT CONTENT //
    const contentClass = props.value ? `${styles.slotFilled} ${props.value === 'X' ? styles.slotFilledX : styles.slotFilledO}` : "";
    
    // ADDITIONNAL SLOT FEATURES //
    let animType = props.animation ? props.animation : '';
    animType = styles[animType];

    // DISPLAY WIN //
    const winClass = props.winStyle ? styles.wonSlot : '';
    let coeff = -1;
  return (
    <button
    	className={`${styles.slot} ${contentClass} ${winClass}`}
    	onClick={props.onClick}
    >
      <div 	style={{'--slotStartPos': `calc(${coeff * slotScore * 133.3}%)`,'--speed': `${speed}s`}}
						className={`${transitionClass} ${animType ? animType : ''}`} onTransitionEnd={props.handleTransitionEnd}>
      </div>
    </button>
  );
}

export default Slot;