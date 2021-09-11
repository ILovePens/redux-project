import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  handleClick,
  jumpTo,
  toggleSort,
  toggleGravity,
  flipBoard,
  sendGameSettings,
  syncBase,
  reset,

  selectTransitions,
  selectGravityState,  
  selectGameSettings,
  selectHistory,
  selectStepNumber,
  selectSortIsAsc,
} from './connectXSlice';
import Board from './components/Board';
import Form from './components/Form';
import { Switch, Reset } from '../general/helpers/Components';
import { calculateWinner } from '../general/helpers/Functions';
// CSS
import styles from './ConnectX.module.css';

export function ConnectX() {
  const dispatch = useDispatch();

  const history = useSelector(selectHistory);
  const stepNumber = useSelector(selectStepNumber);
  const currentSlots = history[stepNumber].slots;

  const gameSettings = useSelector(selectGameSettings);
  const boardFlip = history[stepNumber].boardFlip;
  let boardParams = {
    width: gameSettings.width,
    height: gameSettings.height
  }

  let transitions = useSelector(selectTransitions);
  transitions = Object.keys(transitions).length === 0 ? null : transitions;
  // console.log(transitions);
  let winIndexes = [];
  const scoreTarget = gameSettings.scoreTarget;
  if (stepNumber >= (scoreTarget * 2 - 1)) {
    const boardWidth = boardFlip % 2 === 0 ? boardParams.width : boardParams.height;
    winIndexes = calculateWinner((history[stepNumber - 1]).slots, currentSlots, scoreTarget, boardWidth);
  // console.log("winIndexes",winIndexes);
  }
  // We create the move list to be displayed from the history
  let moves = history.map((step, move) => {
    const desc = move ?'Move #' + move : 'Game start';
    const isSelected = stepNumber === move ? true : false;
    const isLatestHistoryMove = move && move === history.length - 1;

    return (
      <li key={move}>
        <Board
          boardParams={boardParams}        
          isSelected={isSelected}
          slots={history[move].slots}
          transitions={isLatestHistoryMove ? transitions : null}
          flip={history[move].boardFlip}
          onClick={() => dispatch(jumpTo(move))}
          title={desc}
        />
      </li>
    );
  });

  const sortIsAsc = useSelector(selectSortIsAsc);
  // We sort the resulting array in descending order if the toggle is on
  moves = sortIsAsc ? moves : moves.sort((a, b) => b.key - a.key);


  ////////////////////// SET better rules for the game flow and build next player detection accordingly ////////////
  // Choose which game status has to be displayed
  let player = (stepNumber % 2) === 0 ?  'X' : 'O';
  let status;

  if (winIndexes.length) {
    let streakCount = 0;
    winIndexes.forEach(index => {
      if(currentSlots[index] === 'X') streakCount++;
    });
    if(streakCount > winIndexes.length - streakCount) {
      status = 'Winner: X';
    } else if (streakCount < winIndexes.length - streakCount){
      status = 'Winner: O';
    } else {
      status = 'Draw!'
    }
  } else if (!winIndexes.length && stepNumber === currentSlots.length) {
    status = 'Draw!'
  } else {
    status = 'Next player: ' + player
  }
  return (
    <div className={styles.game}>
      {/*PROTECT FORM INPUTS FROM VALUES TOO BIG*/}
      <Form sendGameSettings={(i) => dispatch(sendGameSettings(i))} />
      <Board
        isMainBoard={true}
        boardParams={boardParams}
        slots={currentSlots}
        transitions={transitions}
        flip={boardFlip}
        winIndexes={winIndexes}
        onClick={(i) => dispatch(handleClick(i))}
        syncBase={(i) => dispatch(syncBase(i))}
      />
      <div className={styles.game_info}>
        <div className={styles.status}>{status}</div>
        <div className={styles.controls}>
          <button onClick={() => dispatch(flipBoard(1))}>Flip right</button>
          <button onClick={() => dispatch(flipBoard(-1))}>Flip left</button>
          <Switch isOn={!sortIsAsc} onClick={() => dispatch(toggleSort())}/>
          <Switch isOn={useSelector(selectGravityState)} onClick={() => dispatch(toggleGravity(true))}/>
          <Reset title="Reset" onClick={() => dispatch(reset())}/>
        </div>
      {/*Restructure the scroll box so it expands as the moves come in, but make it scrollable so it slides under the main div
         Basically remove the scroll bar entirely, make the bottom of the page a div that translateY onScrollEvent*/}
        <div className={styles.scrollableY}>
          <ol className={styles.moves}>{moves}</ol>
        </div>
      </div>
    </div>
  );
}
