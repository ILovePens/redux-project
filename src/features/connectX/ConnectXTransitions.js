// CSS
import styles from './ConnectX.module.css';

// WIN DISPLAY //
export function styleWin() {
  const slots = Array.from(document.querySelectorAll('.wonSlot'));
  console.log(slots);
  slots.forEach(e => {
    e.classList.add(styles.win);
  });    
};

// LAUNCH TRANSITIONS //
export function animateBoards() {
  // We get all elements with the transition class
  const animatedElements = Array.from(document.querySelectorAll('.hasTransition'));
  animatedElements.forEach(e => {
    // First we clear out the class on the previously animated elements
    e.classList.remove(styles.animate);
    // We trust the transitions for animations happening after this update
    setTimeout(() => { e.classList.add(styles.animate); }, 0);
  });
};
