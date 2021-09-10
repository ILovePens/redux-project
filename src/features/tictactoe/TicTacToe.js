import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  handleClick,
  jumpTo,
  toggleSort,
  reset,

  selectHistory,
  selectStepNumber,
  selectSortIsAsc,
  selectXIsNext
} from './tictactoeSlice';
import Board from './components/Board';
import {Switch, Reset} from '../general/helpers/Components';
import styles from './Tictactoe.module.css';

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return [];
}

export function TicTacToe() {
  
  const dispatch = useDispatch();

  const history = useSelector(selectHistory);
  const stepNumber = useSelector(selectStepNumber);
  // const history = useSelector((state: RootState) => state.tictactoe.history);
  // const stepNumber = useSelector((state: RootState) => state.tictactoe.stepNumber);

  const current = history[stepNumber];
  const winSquares = calculateWinner(current.squares);

  // We create the move list to be displayed from the history
  var moves = history.map((step, move) => {
    const desc = move ?
      'Move #' + move :
      'Game start';
    const isSelected = stepNumber === move ? true : false;
    return (
      <li key={move}>
        <Board
          isSelected={isSelected}
          squares={history[move].squares}
          onClick={() => dispatch(jumpTo(move))}
          title={desc}
        />
      </li>
    );
  });


  const sortIsAsc = useSelector(selectSortIsAsc);
  // We sort the resulting array in descending order if the toggle is on
  moves = sortIsAsc ? moves : moves.sort((a, b) => b.key - a.key);

  // Choose which game status has to be displayed
  const xIsNext = useSelector(selectXIsNext);
  let status;
  if (winSquares.length) {
    status = 'Winner: ' + (xIsNext ? 'O' : 'X')
  } else if (stepNumber === 9 && !winSquares.length) {
    status = 'Draw!'
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O')
  }

  return (
    <div className={styles.game}>
      <Board 
        squares={current.squares}
        winSquares={winSquares}
        onClick={(i) => dispatch(handleClick(i))}
      />
      <div className={styles.game_info}>
        <div>{status}</div>
        <Switch onClick={() => dispatch(toggleSort())}/>
        <Reset title="Reset" onClick={() => dispatch(reset())}/>
        <div className={styles.scrollableY}>
          <ol className={styles.moves}>{moves}</ol>
        </div>
      </div>
    </div>
  );
}
