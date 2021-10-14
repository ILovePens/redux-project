// CSS
import styles from './ConnectX.module.css';

// WIN DISPLAY //
export function styleWin() {
  const slots = Array.from(document.querySelectorAll('.wonSlot'));
  slots.forEach(e => {
    e.classList.remove('wonSlot');
    e.classList.add(styles.win);
  });    
};

// LAUNCH TRANSITIONS //
export function transitionBoards() {
  // We get all elements with the transition class
  const transitionedElements = Array.from(document.querySelectorAll('.hasTransition'));
  console.log(transitionedElements);
  transitionedElements.forEach(e => {
    // First we clear out the class on the previously animated elements
    e.classList.remove('hasTransition');

    // We trust the transitions for animations happening after this update
    setTimeout(() => { e.classList.add(styles.transition); }, 0);
  });
};
