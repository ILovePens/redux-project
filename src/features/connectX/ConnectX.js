import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  playSlot,
  jumpTo,
  toggleSort,
  gravity,
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
  selectGravityState,  
  selectGameSettings,
  selectHistory,
  selectStepNumber,
  selectSortIsAsc,
  selectTransitions,
  selectAnimations,
} from './connectXSlice';
import Board from './components/Board';
import Form from './components/Form';
import { Switch, Reset } from '../general/helpers/Components';
import { calculateWinner, updateDb } from '../general/helpers/Functions';
// CSS
import styles from './ConnectX.module.css';

export function ConnectX(props) {
  const dispatch = useDispatch();

  const history = useSelector(selectHistory);
  const stepNumber = useSelector(selectStepNumber);
  const gameSettings = useSelector(selectGameSettings);
  const turnAction = useSelector(selectTurnAction);
  const players = useSelector(selectPlayers);
  const currentSign = useSelector(selectCurrentSign);
  const gravityState = useSelector(selectGravityState);
  const transitions = useSelector(selectTransitions);  
  const animations = useSelector(selectAnimations);
  const sortIsAsc = useSelector(selectSortIsAsc);
  const currentSlots = history[stepNumber].slots;
  const playerInfos = props.playerInfos;
  const pseudo = playerInfos.pseudo;

  let gameSettingsForm = <Form sendGameSettings={(i) => dispatch(sendGameSettings(i))} />
  let requestGameButton = <button onClick={() => dispatch(requestGame(playerInfos))}>Request game</button>
  let endTurnButton = null;
  let endTurnFunc;
  let resetButton = <Reset title="Reset" onClick={() => dispatch(reset())}/>

  let gameControls =
    <span>
      <button onClick={() => dispatch(flipBoard(1))}>Flip right</button>
      <button onClick={() => dispatch(flipBoard(-1))}>Flip left</button>
      <Switch isOn={!gravityState} onClick={() => dispatch(gravity({toggle:true}))}/>
    </span>;

  const disabledGameControls =
    <span>
      <button className={styles.disabled} onClick={() => {}}>Flip right</button>
      <button className={styles.disabled} onClick={() => {}}>Flip left</button>
      <Switch className={styles.disabled} isOn={!gravityState} onClick={() => {}}/>
    </span>;

  let playSlotFunc = (i) => dispatch(playSlot(i));

  let gameStatus = history.length === 1 ? 'startOfGame' : 'startOfTurn';
  let asyncGameStatus = '';
  console.log("players",players);
  // Use the stamp to differentiate ourselves from an existing player with the same pseudo
  const idStamp = playerInfos.stamp;
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
        asyncGameStatus = `You are the ${mySign === 'X' ? 'red' : 'blue'} player. ${isMyTurn ? `Your turn to play!` : `It's your opponent's turn.`}`;
        // Writing the DB with the new values if we just used an action 
        if (turnAction.action) {
          updateDb({history, stepNumber, turnAction, currentSign, gravityState, transitions, animations});
        }         

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

  console.log("currentSign",currentSign);
  let gameStyle;
  let reverseGameStyle;
  if (currentSign ===  'X') {
    gameStyle = styles.redPlayerTurn
    reverseGameStyle = styles.bluePlayerTurn
  } else {
    gameStyle = styles.bluePlayerTurn
    reverseGameStyle = styles.redPlayerTurn
  }
  // We want the player to use one of his two actions to fill a slot
  if (turnAction.number) {
    const previousAction = turnAction.type;
    console.log("previousAction",previousAction);
    if (previousAction === 1) {
      playSlotFunc = () => {};
      endTurnButton = <button onClick={() => dispatch(endTurn())}>End turn</button>
      endTurnFunc = () => dispatch(endTurn());
      gameStyle = {
        current: `${gameStyle}`, 
        previous: `${styles.canEndTurn} ${styles.fadeInOnHover} ${styles.hasTransition}`,
        disabled: true
      };
      gameStatus = 'canEndTurn';
      // saveSessionItems 
      
    } else {
      gameStyle = {current: `${gameStyle}`, previous: ``};
      gameControls = disabledGameControls;
      gameStatus = 'hasToPlay';
    }
  } else {
    console.log(transitions);
    gameStyle = {
      current: gameStyle,
      previous: history.length > 1 ? `${transitions.status ? `${styles.endTurn} ${reverseGameStyle}`: reverseGameStyle} ${styles.fadeout} ${styles.hasTransition}` : ''
    };
  }

  const boardFlip = history[stepNumber].boardFlip;
  const boardParams = {
    width: gameSettings.width,
    height: gameSettings.height
  }

  // We create the move list to be displayed from the history
  let moves = history.map((step, move) => {
    const desc = move ?'Move #' + move : 'Game start';
    const isSelected = stepNumber === move ? true : false;
    const isLatestHistoryMove = move === history.length - 1;

    return (
      <li key={move}>
        <p><span>{desc}</span></p>
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

  // We sort the resulting array in descending order if the toggle is on
  moves = sortIsAsc ? moves : moves.sort((a, b) => b.key - a.key);


  let status;
  let winIndexes = [];
  const scoreTarget = gameSettings.scoreTarget;
  if (stepNumber >= (scoreTarget * 2 - 1)) {
    const boardWidth = boardFlip % 2 === 0 ? boardParams.width : boardParams.height;
    winIndexes = calculateWinner((history[stepNumber - 1]).slots, currentSlots, scoreTarget, boardWidth);
  }
  if (winIndexes.length) {
    gameControls = disabledGameControls;
    endTurnFunc = () => {};
    playSlotFunc = () => {};
    gameStatus = 'endOfGame';
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
    gameStatus = 'endOfGame';
  } /*else if (turnAction.type === 1) {
    status = 'Next player: ' + player === 'X' ? 'O' : 'X'
  } */else {
    status = `${currentSign === 'X' ? 'Red' : 'Blue'} player's turn`
  }
  return (
    <div className={styles.game}>
      <div className={styles.gameInfos}>
        <span className={styles.status}>{status} - {gameStatus}</span>
        {gameSettingsForm}
        {asyncGameStatus}
      </div>
      <Board
        isMainBoard={true}
        statusClass={gameStyle}
        boardParams={boardParams}
        slots={currentSlots}
        flip={boardFlip}
        winIndexes={winIndexes}
        onClick={(i) => playSlotFunc(i)}
        endTurnFunc={endTurnFunc}
        transitions={transitions}
        animations={animations}
      />
      <div className={styles.controls}>
        {requestGameButton}
        {gameControls}
        {endTurnButton}
        {resetButton}
      </div>
      <div className={styles.scrollableX}>
        <Switch isOn={!sortIsAsc} styles={styles.toggleSort} onClick={() => dispatch(toggleSort())}/>
        <ol className={styles.moves}>{moves}</ol>
      </div>
      
    </div>
  );
}
