import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  handleClick,
  jumpTo,
  toggleSort,
  toggleGravity,
  flipBoard,
  sendGameSettings,
  watchGame,
  requestGame,
  reset,

  actionsPerTurn,
  selectTwoPlayersMode,
  selectTurnAction,
  selectPlayers,
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

// DATABASE
import { getDatabase, ref } from "firebase/database";
import "firebase/database";

export function ConnectX(props) {
  const dispatch = useDispatch();

  const history = useSelector(selectHistory);
  const stepNumber = useSelector(selectStepNumber);

  const currentSlots = history[stepNumber].slots;
  const turnAction = useSelector(selectTurnAction);
  const players = useSelector(selectPlayers);
  const inGame = useSelector(selectTwoPlayersMode);
  const pseudo = props.pseudo;

  let gameSettingsForm = <Form sendGameSettings={(i) => dispatch(sendGameSettings(i))} />
  let requestGameButton = <button onClick={() => dispatch(requestGame(pseudo))}>Request game</button>

  let boardClickFunc = (i) => dispatch(handleClick(i));
  let toggleGravityFunc = () => dispatch(toggleGravity(true));
  let flipBoardR = () => dispatch(flipBoard(1));
  let flipBoardL = () => dispatch(flipBoard(-1));

  let player = (stepNumber % 2) === 0 ?  'X' : 'O';

  if (players.length > 0) {
    const myPlayer = players.find(e => e.pseudo === pseudo);
    const isPlayer = myPlayer !== -1;
    const gameInProgress = players.length === 2 && !isPlayer;
    const waitingForGame = players.length === 1 && isPlayer;

    console.log("myPlayer",myPlayer);
    console.log("player",player);
    if (waitingForGame || inGame) {
      window.onunload = function(event) {
        dispatch(reset(true));
      };
      gameSettingsForm = null;
    }
    if (gameInProgress || isPlayer) {
      requestGameButton = null
    }

    if (inGame) {
      const isMyTurn = myPlayer.sign === player ? true : false;
      if (!isMyTurn) {
        dispatch(watchGame());

        // DEACTIVATE DB STATE CHANGING ACTIONS
        boardClickFunc = () => {};
        toggleGravityFunc = () => {};
        flipBoardR = () => {};
        flipBoardL = () => {};
      }
    }
  }

  if (turnAction) {
    toggleGravityFunc = () => {};
    flipBoardR = () => {};
    flipBoardL = () => {};
  }


  const gameSettings = useSelector(selectGameSettings);
  const boardFlip = history[stepNumber].boardFlip;
  let boardParams = {
    width: gameSettings.width,
    height: gameSettings.height
  }

  let transitions = useSelector(selectTransitions);
  let winIndexes = [];
  const scoreTarget = gameSettings.scoreTarget;
  console.log("scoreTarget",scoreTarget);
  if (stepNumber >= (scoreTarget * 2 - 1)) {
    const boardWidth = boardFlip % 2 === 0 ? boardParams.width : boardParams.height;
    winIndexes = calculateWinner((history[stepNumber - 1]).slots, currentSlots, scoreTarget, boardWidth);
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
      {gameSettingsForm/* <-- PROTECT FORM INPUTS FROM VALUES TOO BIG*/}
      <Board
        isMainBoard={true}
        boardParams={boardParams}
        slots={currentSlots}
        transitions={transitions}
        flip={boardFlip}
        winIndexes={winIndexes}
        onClick={(i) => boardClickFunc(i)}
      />
      <div className={styles.game_info}>
        <div className={styles.status}>{status}</div>
        <div className={styles.controls}>
          {requestGameButton}
          <button onClick={() => flipBoardR()}>Flip right</button>
          <button onClick={() => flipBoardL()}>Flip left</button>
          <Switch isOn={!sortIsAsc} onClick={() => dispatch(toggleSort())}/>
          <Switch isOn={!useSelector(selectGravityState)} onClick={() => toggleGravityFunc()}/>
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
