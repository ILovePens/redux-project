import React from 'react';
// CSS
import styles from '../ConnectX.module.css';

function Slot(props) {

		// FALL ANIMATION //
		const slotScore = props.slotScore;
		let transitionClass = "";
		let speed = 0
		if (slotScore) {
			transitionClass = `hasTransition ${styles.fall}`;
			speed = Math.round((0.16 + 0.189 * Math.log(slotScore)) * 10) / 10;
		}

		// DISPLAY SLOT CONTENT //
    const contentClass = props.value ? `${styles.slotContent} ${props.value === 'X' ? styles.slotContentX : styles.slotContentO}` : "";
    
    // ADDITIONNAL SLOT FEATURES //
    let animType = props.animation ? props.animation : '';
    animType = styles[animType];

    // DISPLAY WIN //
    const winClass = props.winStyle ? 'wonSlot' : '';
    let coeff = -1;
  return (
    <button
    	className={`${styles.slot} ${winClass}`}
    	onClick={props.onClick}
    >
      <div 	style={{'--slotStartPos': `calc(${coeff * slotScore * 125}% + ${slotScore}px)`,'--speed': `${speed}s`}}
						className={`${contentClass} ${transitionClass} ${animType}`} onTransitionEnd={props.handleTransitionEnd}>
      </div>
    </button>
  );
}

export default Slot;