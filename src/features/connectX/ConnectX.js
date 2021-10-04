import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  playSlot,
  jumpTo,
  toggleSort,
  toggleGravity,
  flipBoard,
  endTurn,  
  sendGameSettings,
  watchGame,
  requestGame,
  reset,
  initPlayers,  
  removePlayers,

  selectTurnAction,
  selectCurrentSign,
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

export function ConnectX(props) {
  const dispatch = useDispatch();

  let history = useSelector(selectHistory);
  const stepNumber = useSelector(selectStepNumber);

  const currentSlots = history[stepNumber].slots;
  const turnAction = useSelector(selectTurnAction);
  const players = useSelector(selectPlayers);
  const playerInfos = props.playerInfos;

  let gameSettingsForm = <Form sendGameSettings={(i) => dispatch(sendGameSettings(i))} />
  let requestGameButton = <button onClick={() => dispatch(requestGame(playerInfos))}>Request game</button>
  let endTurnButton = null;
  let resetButton = <Reset title="Reset" onClick={() => dispatch(reset())}/>

  let gameControls =
    <span>
      <button onClick={() => dispatch(flipBoard(1))}>Flip right</button>
      <button onClick={() => dispatch(flipBoard(-1))}>Flip left</button>
      <Switch isOn={!useSelector(selectGravityState)} onClick={() => dispatch(toggleGravity({toggle:true}))}/>
    </span>;

  const disabledGameControls =
    <span>
      <button className={styles.disabled} onClick={() => {}}>Flip right</button>
      <button className={styles.disabled} onClick={() => {}}>Flip left</button>
      <Switch className={styles.disabled} isOn={!useSelector(selectGravityState)} onClick={() => {}}/>
    </span>;

  let playSlotFunc = (i) => dispatch(playSlot(i));

  const currentSign = useSelector(selectCurrentSign);
  console.log("currentSign",currentSign);
  console.log("players",players);
  const pseudo = playerInfos.pseudo;
  // Use the stamp to differentiate ourselves from an existing player with the same pseudo
  const idStamp = playerInfos.stamp;
  let gameStatusClass = '';
  if (players && players.length > 0) {
    const playerCount = players.length;
    console.log("playerCount",playerCount);

    const myPlayer = players.find(e => e.player.pseudo === pseudo && e.player.stamp === idStamp);
    const isPlayer = myPlayer !== undefined;
    console.log("myplayer",myPlayer);

    if (isPlayer) {
      const waitingForGame = playerCount === 1;
      const inGame = playerCount === 2;
  
      if (waitingForGame || inGame) {
        console.log("waitingForGame",waitingForGame);
        window.onunload = function(event) {
          dispatch(removePlayers());
        };
      }
  
      if (inGame) {
        const mySign = myPlayer.sign;
        const isMyTurn = mySign === currentSign ? true : false;
        console.log(isMyTurn);
        if (!isMyTurn) {
          dispatch(watchGame(mySign));
          playSlotFunc = () => {};
          gameControls = disabledGameControls;
        }
        gameSettingsForm = null;
        resetButton = null;
      }
      
      requestGameButton = null;

    } else {
      const gameInProgress = playerCount === 2;
      const opponentWaiting = playerCount === 1;
  
      if (gameInProgress) {
        requestGameButton = null;
      }
      if (opponentWaiting) {
        requestGameButton = <button className={styles.highlighted} onClick={() => dispatch(requestGame(playerInfos))}>Join game</button>;
      }
    }
  } else if (!players) {
    console.log("am i crazy", players);
    dispatch(initPlayers());
  }

  // We want the player to use one of his two actions to fill a slot
  if (turnAction.number) {
    const previousAction = turnAction.action;
    if (previousAction === 1) {
      playSlotFunc = () => {};
      endTurnButton = <button onClick={() => dispatch(endTurn())}>End turn</button>
      gameStatusClass = styles.canEndTurn;
    } else {
      gameControls = disabledGameControls;
    }
  }

  const gameSettings = useSelector(selectGameSettings);
  const boardFlip = history[stepNumber].boardFlip;
  const boardParams = {
    width: gameSettings.width,
    height: gameSettings.height
  }

  let transitions = useSelector(selectTransitions);
  let winIndexes = [];
  const scoreTarget = gameSettings.scoreTarget;
  if (stepNumber >= (scoreTarget * 2 - 1)) {
    const boardWidth = boardFlip % 2 === 0 ? boardParams.width : boardParams.height;
    winIndexes = calculateWinner((history[stepNumber - 1]).slots, currentSlots, scoreTarget, boardWidth);
  }
  
  // We create the move list to be displayed from the history
  let moves = history.map((step, move) => {
    const desc = move ?'Move #' + move : 'Game start';
    const isSelected = stepNumber === move ? true : false;
    const isLatestHistoryMove = move === history.length - 1;

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

  // Choose which game status has to be displayed !!!!!!!!!! IMPROVE DISPLAY !!!!!!!!!!!!!!
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
  } /*else if (turnAction.action === 1) {
    status = 'Next player: ' + player === 'X' ? 'O' : 'X'
  } */else {
    status = 'Next player: ' + currentSign
  }
  return (
    <div className={styles.game}>
      {gameSettingsForm}
      <Board
        isMainBoard={true}
        statusClass={gameStatusClass}
        boardParams={boardParams}
        slots={currentSlots}
        transitions={transitions}
        flip={boardFlip}
        winIndexes={winIndexes}
        onClick={(i) => playSlotFunc(i)}
      />
      <div className={styles.game_info}>
        <div className={styles.status}>{status}</div>
        <div className={styles.controls}>
          {requestGameButton}
          {gameControls}
          <Switch isOn={!sortIsAsc} onClick={() => dispatch(toggleSort())}/>
          {endTurnButton}
          {resetButton}
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
